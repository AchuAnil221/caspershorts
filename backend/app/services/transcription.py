"""
Transcription Service
Uses OpenAI Whisper API to transcribe audio files with word-level timestamps.
"""

import logging
import os
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class ConfigurationError(Exception):
    """Raised when a required configuration (e.g., API key) is missing."""


class TranscriptionError(Exception):
    """Raised when transcription fails."""


class TranscriptionService:
    """Transcribes audio using the OpenAI Whisper API."""

    SUPPORTED_FORMATS = {".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"}

    def __init__(self, api_key: Optional[str] = None):
        self._api_key = api_key or os.environ.get("OPENAI_API_KEY")
        self._client = None  # lazy-initialised

    def _get_client(self):
        """Return (and cache) an OpenAI client, raising ConfigurationError if key absent."""
        if self._client is not None:
            return self._client

        if not self._api_key:
            raise ConfigurationError(
                "OPENAI_API_KEY is not set. "
                "Please add it to your .env file or export it in your shell: "
                "export OPENAI_API_KEY='sk-...'"
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

    async def transcribe_audio(
        self,
        audio_path: str,
        language: str = "auto",
    ) -> dict:
        """
        Transcribe an audio file using Whisper.

        Returns:
            {
                "text": str,
                "language": str,
                "duration": float,
                "segments": [
                    {
                        "id": int,
                        "start": float,
                        "end": float,
                        "text": str,
                        "words": [{"word": str, "start": float, "end": float}]
                    }
                ]
            }
        """
        audio_path = str(Path(audio_path).resolve())
        suffix = Path(audio_path).suffix.lower()
        if suffix not in self.SUPPORTED_FORMATS:
            raise TranscriptionError(
                f"Unsupported audio format '{suffix}'. "
                f"Supported: {', '.join(self.SUPPORTED_FORMATS)}"
            )

        client = self._get_client()

        lang_param = None if language == "auto" else language
        logger.info("Transcribing %s (language=%s)", audio_path, language)

        try:
            with open(audio_path, "rb") as audio_file:
                response = await client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=lang_param,
                    response_format="verbose_json",
                    timestamp_granularities=["word", "segment"],
                )
        except Exception as exc:
            raise TranscriptionError(f"Whisper transcription failed: {exc}") from exc

        logger.info("Transcription complete — %d segments", len(response.segments or []))

        # Normalise to our internal schema
        segments = []
        for seg in response.segments or []:
            words = []
            for w in getattr(seg, "words", None) or []:
                words.append(
                    {
                        "word": w.word.strip(),
                        "start": float(w.start),
                        "end": float(w.end),
                    }
                )
            segments.append(
                {
                    "id": seg.id,
                    "start": float(seg.start),
                    "end": float(seg.end),
                    "text": seg.text.strip(),
                    "words": words,
                }
            )

        return {
            "text": response.text,
            "language": getattr(response, "language", language),
            "duration": float(getattr(response, "duration", 0)),
            "segments": segments,
        }

    async def format_word_timestamps(self, segments: list) -> list:
        """
        Flatten segment-level word timestamps into a single ordered list.

        Returns:
            [{"word": str, "start": float, "end": float, "segment_id": int}]
        """
        words = []
        for seg in segments:
            seg_id = seg.get("id", 0)
            for w in seg.get("words", []):
                words.append(
                    {
                        "word": w["word"],
                        "start": w["start"],
                        "end": w["end"],
                        "segment_id": seg_id,
                    }
                )
        # Sort by start time (should already be ordered, but be defensive)
        words.sort(key=lambda x: x["start"])
        return words
