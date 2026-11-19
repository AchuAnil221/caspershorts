"""
AI Analysis Service
Uses GPT-4o to identify engaging highlight moments in a transcript.
"""

import json
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)


class ConfigurationError(Exception):
    """Raised when a required API key or config is missing."""


class AIAnalysisService:
    """Identifies viral highlights in video transcripts using GPT-4o."""

    # Scoring weights (must sum to 1.0)
    WEIGHTS = {
        "hook": 0.30,
        "context": 0.25,
        "engagement": 0.30,
        "duration_fit": 0.15,
    }

    # Ideal clip duration range (seconds)
    IDEAL_MIN = 30
    IDEAL_MAX = 90

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o"):
        self._api_key = api_key or os.environ.get("OPENAI_API_KEY")
        self._model = model
        self._client = None  # lazy init

    def _get_client(self):
        if self._client is not None:
            return self._client
        if not self._api_key:
            raise ConfigurationError(
                "OPENAI_API_KEY is not set. "
                "Please add it to your .env file: OPENAI_API_KEY=sk-..."
            )
        try:
            from openai import AsyncOpenAI  # type: ignore
        except ImportError as exc:
            raise ConfigurationError(
                "openai package is not installed. Run: pip install openai"
            ) from exc
        self._client = AsyncOpenAI(api_key=self._api_key)
        return self._client

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def identify_highlights(self, transcript: dict, settings: dict) -> list:
        """
        Send transcript to GPT-4o and return highlight candidates.

        Returns:
            [
                {
                    "start_time": float,
                    "end_time": float,
                    "title": str,
                    "reasoning": str,
                    "scores": {"hook": int, "context": int, "engagement": int, "duration": int}
                }
            ]
        """
        client = self._get_client()
        transcript_text = transcript.get("text", "")
        if not transcript_text.strip():
            logger.warning("Empty transcript — returning no highlights")
            return []

        system_prompt, user_prompt = self._build_analysis_prompt(transcript_text, settings)
        logger.info("Sending transcript (%d chars) to %s for highlight detection", len(transcript_text), self._model)

        try:
            response = await client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.3,
                response_format={"type": "json_object"},
                max_tokens=4096,
            )
        except Exception as exc:
            raise RuntimeError(f"GPT highlight detection failed: {exc}") from exc

        raw = response.choices[0].message.content
        logger.debug("GPT response: %s", raw[:500])

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"GPT returned invalid JSON: {exc}\nRaw: {raw}") from exc

        highlights = parsed.get("highlights", [])

        # Validate and normalise each highlight
        clean = []
        for h in highlights:
            try:
                start = float(h["start_time"])
                end = float(h["end_time"])
                if end <= start:
                    continue
                scores = {
                    "hook": int(h.get("scores", {}).get("hook", 50)),
                    "context": int(h.get("scores", {}).get("context", 50)),
                    "engagement": int(h.get("scores", {}).get("engagement", 50)),
                    "duration": int(h.get("scores", {}).get("duration", 50)),
                }
                clean.append(
                    {
                        "start_time": start,
                        "end_time": end,
                        "title": str(h.get("title", "Highlight")),
                        "reasoning": str(h.get("reasoning", "")),
                        "scores": scores,
                    }
                )
            except (KeyError, ValueError, TypeError) as exc:
                logger.warning("Skipping malformed highlight: %s — %s", h, exc)

        logger.info("Identified %d valid highlights", len(clean))
        return clean

    async def score_clips(self, candidates: list) -> list:
        """
        Calculate a 0-100 overall AI score for each candidate and sort descending.

        Score = hook*0.30 + context*0.25 + engagement*0.30 + duration_fit*0.15
        """
        scored = []
        for c in candidates:
            s = c.get("scores", {})
            duration = c["end_time"] - c["start_time"]
            duration_fit = self._duration_score(duration)

            overall = (
                s.get("hook", 50) * self.WEIGHTS["hook"]
                + s.get("context", 50) * self.WEIGHTS["context"]
                + s.get("engagement", 50) * self.WEIGHTS["engagement"]
                + duration_fit * self.WEIGHTS["duration_fit"]
            )
            scored.append({**c, "ai_score": round(overall, 1)})

        scored.sort(key=lambda x: x["ai_score"], reverse=True)
        return scored

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _duration_score(self, duration: float) -> float:
        """Score a clip's duration fitness (0-100). Peak score in 30-90s range."""
        if self.IDEAL_MIN <= duration <= self.IDEAL_MAX:
            return 100.0
        elif duration < self.IDEAL_MIN:
            # Linear decay below minimum
            return max(0, 100 * (duration / self.IDEAL_MIN))
        else:
            # Linear decay above maximum
            over = duration - self.IDEAL_MAX
            return max(0, 100 - (over / self.IDEAL_MAX) * 100)

    def _build_analysis_prompt(self, transcript_text: str, settings: dict) -> tuple[str, str]:
        """
        Build the system + user prompt for GPT highlight detection.

        Returns (system_prompt, user_prompt).
        """
        max_clips = settings.get("max_clips", 5)
        min_duration = settings.get("min_clip_duration", 30)
        max_duration = settings.get("max_clip_duration", 90)
        content_type = settings.get("content_type", "general")

        system_prompt = (
            "You are an expert video editor and viral content strategist specialised in "
            "creating short-form clips for TikTok, Instagram Reels, and YouTube Shorts. "
            "Your task is to analyse video transcripts and identify the most engaging segments "
            "that will perform well as standalone short clips.\n\n"
            "Scoring criteria (each 0-100):\n"
            "- hook: Does the first 5 seconds grab attention immediately?\n"
            "- context: Does the clip make sense on its own without the full video?\n"
            "- engagement: Is it funny, surprising, educational, or emotionally resonant?\n"
            "- duration: Does the clip fit the ideal 30-90 second range?\n\n"
            "ALWAYS respond with valid JSON in the exact format specified."
        )

        user_prompt = (
            f"Analyse the following transcript and identify the top {max_clips} most viral-worthy moments.\n\n"
            f"Content type: {content_type}\n"
            f"Target clip duration: {min_duration}–{max_duration} seconds\n\n"
            f"TRANSCRIPT:\n{transcript_text}\n\n"
            "Return a JSON object with this exact structure:\n"
            "{\n"
            '  "highlights": [\n'
            "    {\n"
            '      "start_time": <number, seconds>,\n'
            '      "end_time": <number, seconds>,\n'
            '      "title": "<short catchy title for the clip>",\n'
            '      "reasoning": "<2-3 sentences explaining why this moment is engaging>",\n'
            '      "scores": {\n'
            '        "hook": <0-100>,\n'
            '        "context": <0-100>,\n'
            '        "engagement": <0-100>,\n'
            '        "duration": <0-100>\n'
            "      }\n"
            "    }\n"
            "  ]\n"
            "}\n\n"
            "Rules:\n"
            "- Identify moments with strong openings (questions, surprising statements, bold claims)\n"
            "- Prefer story-complete clips with a clear beginning, middle, and end\n"
            "- Avoid clips starting mid-sentence unless the hook is exceptionally strong\n"
            "- Clips should not overlap\n"
            f"- Each clip must be between {min_duration} and {max_duration} seconds\n"
            f"- Return exactly {max_clips} highlights (or fewer if the transcript is short)\n"
        )

        return system_prompt, user_prompt
