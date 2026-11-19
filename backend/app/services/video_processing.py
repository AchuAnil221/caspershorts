"""
Video Processing Service
Handles FFmpeg-based video operations: audio extraction, clipping,
aspect ratio conversion, subtitle burning, thumbnail generation, compression.
"""

import asyncio
import json
import logging
import os
import subprocess
import tempfile
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class VideoProcessingError(Exception):
    """Raised when a video processing operation fails."""


class VideoProcessor:
    """Async wrapper around FFmpeg for all video manipulation tasks."""

    def __init__(self, ffmpeg_path: str = "ffmpeg", ffprobe_path: str = "ffprobe"):
        self.ffmpeg = ffmpeg_path
        self.ffprobe = ffprobe_path

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    async def _run(self, cmd: list[str]) -> subprocess.CompletedProcess:
        """Run a command in a thread pool so we never block the event loop."""
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: subprocess.run(
                cmd,
                capture_output=True,
                text=True,
            ),
        )
        if result.returncode != 0:
            raise VideoProcessingError(
                f"FFmpeg command failed (exit {result.returncode}):\n"
                f"CMD:    {' '.join(cmd)}\n"
                f"STDERR: {result.stderr}"
            )
        return result

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def extract_audio(self, video_path: str, output_path: Optional[str] = None) -> str:
        """Extract audio track from a video file to WAV (16-kHz mono) for Whisper."""
        video_path = str(Path(video_path).resolve())
        if output_path is None:
            tmp_dir = tempfile.mkdtemp(prefix="casper_audio_")
            output_path = os.path.join(tmp_dir, "audio.wav")

        logger.info("Extracting audio: %s -> %s", video_path, output_path)
        cmd = [
            self.ffmpeg, "-y",
            "-i", video_path,
            "-vn",                    # no video
            "-acodec", "pcm_s16le",   # PCM 16-bit
            "-ar", "16000",           # 16 kHz — Whisper optimal
            "-ac", "1",               # mono
            output_path,
        ]
        await self._run(cmd)
        logger.info("Audio extracted to %s", output_path)
        return output_path

    async def get_video_metadata(self, video_path: str) -> dict:
        """Return duration, resolution, fps, codec info via ffprobe."""
        video_path = str(Path(video_path).resolve())
        cmd = [
            self.ffprobe,
            "-v", "quiet",
            "-print_format", "json",
            "-show_streams",
            "-show_format",
            video_path,
        ]
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: subprocess.run(cmd, capture_output=True, text=True),
        )
        if result.returncode != 0:
            raise VideoProcessingError(f"ffprobe failed: {result.stderr}")

        probe = json.loads(result.stdout)
        video_stream = next(
            (s for s in probe.get("streams", []) if s.get("codec_type") == "video"),
            {},
        )
        audio_stream = next(
            (s for s in probe.get("streams", []) if s.get("codec_type") == "audio"),
            {},
        )
        fmt = probe.get("format", {})

        # Parse FPS (stored as "30000/1001" fraction)
        fps_raw = video_stream.get("r_frame_rate", "0/1")
        try:
            num, den = map(int, fps_raw.split("/"))
            fps = round(num / den, 3) if den else 0.0
        except Exception:
            fps = 0.0

        return {
            "duration": float(fmt.get("duration", 0)),
            "size_bytes": int(fmt.get("size", 0)),
            "format": fmt.get("format_name", ""),
            "width": video_stream.get("width"),
            "height": video_stream.get("height"),
            "fps": fps,
            "video_codec": video_stream.get("codec_name"),
            "audio_codec": audio_stream.get("codec_name"),
            "bit_rate": int(fmt.get("bit_rate", 0)),
            "nb_streams": fmt.get("nb_streams"),
        }

    async def extract_clip(
        self,
        video_path: str,
        start: float,
        end: float,
        output_path: Optional[str] = None,
    ) -> str:
        """Trim video between start and end seconds (re-encoded for accuracy)."""
        video_path = str(Path(video_path).resolve())
        if output_path is None:
            tmp_dir = tempfile.mkdtemp(prefix="casper_clip_")
            output_path = os.path.join(tmp_dir, "clip.mp4")

        duration = end - start
        if duration <= 0:
            raise VideoProcessingError(f"Invalid clip range: start={start}, end={end}")

        logger.info("Extracting clip %.2f-%.2f from %s", start, end, video_path)
        cmd = [
            self.ffmpeg, "-y",
            "-ss", str(start),
            "-i", video_path,
            "-t", str(duration),
            "-sn",                    # Strip any original/YouTube subtitle tracks
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "128k",
            "-movflags", "+faststart",
            output_path,
        ]
        await self._run(cmd)
        return output_path

    async def convert_aspect_ratio(
        self,
        input_path: str,
        output_path: str,
        ratio: str = "9:16",
        mode: str = "blur_padded",
        tracking_data: Optional[list] = None,
    ) -> str:
        """
        Convert aspect ratio to vertical (9:16), square (1:1), or landscape (16:9).

        Modes:
        - "blur_padded" (Default for 9:16): Scales the video to fill 9:16 canvas with
          Gaussian motion blur on top/bottom, placing the sharp video centrally.
        - "smart_crop": Uses face/speaker tracking or center crop.
        """
        input_path = str(Path(input_path).resolve())
        meta = await self.get_video_metadata(input_path)
        src_w = meta["width"]
        src_h = meta["height"]

        if ratio == "9:16" and mode == "blur_padded":
            logger.info("Converting %s to 9:16 with OpusClip blurred top/bottom layout", input_path)
            filter_complex = (
                "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:5[bg];"
                "[0:v]scale=1080:-2:force_original_aspect_ratio=decrease[fg];"
                "[bg][fg]overlay=(W-w)/2:(H-h)/2[outv]"
            )
            cmd = [
                self.ffmpeg, "-y",
                "-i", input_path,
                "-filter_complex", filter_complex,
                "-map", "[outv]",
                "-map", "0:a?",
                "-sn",
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "23",
                "-c:a", "aac",
                "-b:a", "128k",
                "-movflags", "+faststart",
                output_path,
            ]
            await self._run(cmd)
            return output_path

        if ratio == "9:16":
            target_w = int(src_h * 9 / 16)
            target_h = src_h
            target_w = target_w - (target_w % 2)
        elif ratio == "1:1":
            side = min(src_w, src_h)
            target_w = side - (side % 2)
            target_h = side - (side % 2)
        elif ratio == "16:9":
            # Already landscape; just re-encode
            target_w = src_w - (src_w % 2)
            target_h = src_h - (src_h % 2)
        else:
            raise VideoProcessingError(f"Unsupported ratio: {ratio}")

        # Determine crop X offset
        if tracking_data:
            # Average face centre across clip frames
            cx_values = []
            for frame in tracking_data:
                for face in frame.get("faces", []):
                    cx_values.append(face["x"] + face["w"] / 2)
            if cx_values:
                avg_cx = sum(cx_values) / len(cx_values)
                x_offset = int(avg_cx - target_w / 2)
                x_offset = max(0, min(x_offset, src_w - target_w))
            else:
                x_offset = (src_w - target_w) // 2  # center fallback
        else:
            x_offset = (src_w - target_w) // 2  # center crop

        y_offset = (src_h - target_h) // 2

        logger.info(
            "Converting %s to %s (crop %dx%d at %d,%d)",
            input_path, ratio, target_w, target_h, x_offset, y_offset,
        )

        vf = f"crop={target_w}:{target_h}:{x_offset}:{y_offset},scale={target_w}:{target_h}"
        cmd = [
            self.ffmpeg, "-y",
            "-i", input_path,
            "-vf", vf,
            "-sn",                    # Discard original subtitle streams
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            "-c:a", "aac",
            "-b:a", "128k",
            "-movflags", "+faststart",
            output_path,
        ]
        await self._run(cmd)
        return output_path

    async def add_subtitles(
        self,
        video_path: str,
        subtitle_data: list,
        style: dict,
        output_path: Optional[str] = None,
    ) -> str:
        """
        Burn subtitles into video.

        subtitle_data: list of {start, end, text} dicts.
        style: dict with keys like font, size, color, position.
        Uses ASS subtitle format for rich styling.
        """
        video_path = str(Path(video_path).resolve())
        if output_path is None:
            tmp_dir = tempfile.mkdtemp(prefix="casper_sub_")
            output_path = os.path.join(tmp_dir, "subtitled.mp4")

        # Write ASS to temp file
        ass_path = os.path.join(tempfile.mkdtemp(prefix="casper_ass_"), "subs.ass")
        ass_content = _build_ass(subtitle_data, style)
        Path(ass_path).write_text(ass_content, encoding="utf-8")

        logger.info("Burning subtitles into %s", video_path)
        cmd = [
            self.ffmpeg, "-y",
            "-i", video_path,
            "-vf", f"ass={ass_path}",
            "-sn",                    # Strip any original subtitle streams; only keep Casper Shorts ASS burned subs
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "22",
            "-c:a", "copy",
            "-movflags", "+faststart",
            output_path,
        ]
        await self._run(cmd)
        return output_path

    async def generate_thumbnail(
        self,
        video_path: str,
        timestamp: float = 1.0,
        output_path: Optional[str] = None,
    ) -> str:
        """Extract a single frame as JPEG thumbnail."""
        video_path = str(Path(video_path).resolve())
        if output_path is None:
            tmp_dir = tempfile.mkdtemp(prefix="casper_thumb_")
            output_path = os.path.join(tmp_dir, "thumbnail.jpg")

        cmd = [
            self.ffmpeg, "-y",
            "-ss", str(timestamp),
            "-i", video_path,
            "-frames:v", "1",
            "-q:v", "2",
            output_path,
        ]
        await self._run(cmd)
        return output_path

    async def compress_video(
        self,
        input_path: str,
        output_path: str,
        quality: str = "1080p",
    ) -> str:
        """H.264 compression with quality presets targeting common bitrates."""
        QUALITY_PRESETS = {
            "1080p": {"crf": "20", "maxrate": "4000k", "bufsize": "8000k"},
            "720p":  {"crf": "23", "maxrate": "2500k", "bufsize": "5000k"},
            "480p":  {"crf": "26", "maxrate": "1000k", "bufsize": "2000k"},
            "360p":  {"crf": "28", "maxrate": "600k",  "bufsize": "1200k"},
        }
        preset = QUALITY_PRESETS.get(quality, QUALITY_PRESETS["1080p"])

        logger.info("Compressing %s at %s quality", input_path, quality)
        cmd = [
            self.ffmpeg, "-y",
            "-i", str(Path(input_path).resolve()),
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", preset["crf"],
            "-maxrate", preset["maxrate"],
            "-bufsize", preset["bufsize"],
            "-c:a", "aac",
            "-b:a", "128k",
            "-movflags", "+faststart",
            output_path,
        ]
        await self._run(cmd)
        return output_path


# ---------------------------------------------------------------------------
# ASS subtitle builder (private helper)
# ---------------------------------------------------------------------------

def _build_ass(subtitle_data: list, style: dict) -> str:
    """Build a minimal ASS subtitle file from subtitle_data and style dict."""
    font = style.get("font", "Arial")
    size = style.get("size", 36)
    primary_color = _hex_to_ass(style.get("color", "white"))
    outline_color = _hex_to_ass(style.get("outline", "black"))
    outline_w = style.get("outline_width", 2)
    bold = 1 if style.get("bold") else 0
    shadow = 1 if style.get("shadow") else 0

    alignment = 2  # bottom-centre
    if style.get("position") == "top":
        alignment = 8

    header = (
        "[Script Info]\n"
        "ScriptType: v4.00+\n"
        "Collisions: Normal\n"
        "PlayDepth: 0\n\n"
        "[V4+ Styles]\n"
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, "
        "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, "
        "Alignment, MarginL, MarginR, MarginV, Encoding\n"
        f"Style: Default,{font},{size},{primary_color},&H000000FF,{outline_color},&H80000000,"
        f"{bold},0,0,0,100,100,0,0,1,{outline_w},{shadow},{alignment},10,10,20,0\n\n"
        "[Events]\n"
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
    )

    events = []
    for item in subtitle_data:
        start = _seconds_to_ass_time(item["start"])
        end = _seconds_to_ass_time(item["end"])
        text = item["text"].replace("\n", "\\N")
        events.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")

    return header + "\n".join(events) + "\n"


def _seconds_to_ass_time(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    cs = int((seconds % 1) * 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def _hex_to_ass(color: str) -> str:
    """Convert CSS hex color or named color to ASS AABBGGRR format."""
    NAMED = {
        "white": "FFFFFF",
        "black": "000000",
        "yellow": "FFFF00",
        "red": "0000FF",
        "blue": "FF0000",
    }
    color = color.lstrip("#")
    color = NAMED.get(color.lower(), color)
    if len(color) == 6:
        r, g, b = color[0:2], color[2:4], color[4:6]
        return f"&H00{b}{g}{r}"
    return "&H00FFFFFF"
