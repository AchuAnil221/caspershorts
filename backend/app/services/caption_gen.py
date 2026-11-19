"""
Caption Generator Service
Generates styled SRT and ASS subtitles with word-level karaoke animations
and burns them into videos via FFmpeg.
"""

import os
import tempfile
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


class CaptionGenerator:
    """Handles word-level karaoke subtitle generation and styling."""

    STYLES = {
        "minimal": {
            "font": "Arial",
            "size": 24,
            "color": "&H00FFFFFF",  # ASS White
            "active_color": "&H00FFFFFF",
            "bg": "&H80000000",
            "outline": 1,
            "margin_v": 40,
        },
        "bold": {
            "font": "Impact",
            "size": 36,
            "color": "&H0000FFFF",  # ASS Yellow
            "active_color": "&H0000FFFF",
            "bg": "&H00000000",
            "outline": 3,
            "margin_v": 60,
        },
        "highlight": {
            "font": "Arial Bold",
            "size": 32,
            "color": "&H00FFFFFF",  # Inactive White
            "active_color": "&H00EB6325",  # Electric Blue in BGR
            "bg": "&H00000000",
            "outline": 2,
            "margin_v": 50,
        },
        "creator": {
            "font": "Montserrat Black",
            "size": 34,
            "color": "&H00FFFFFF",
            "active_color": "&H0000E5FF",  # Neon Cyan
            "bg": "&H00000000",
            "outline": 3,
            "margin_v": 55,
        },
        "professional": {
            "font": "Helvetica",
            "size": 26,
            "color": "&H00FFFFFF",
            "active_color": "&H00E0E0E0",
            "bg": "&H991A1A1A",
            "outline": 1,
            "margin_v": 45,
        },
    }

    def format_timestamp_ass(self, seconds: float) -> str:
        """Format seconds into ASS timestamp: H:MM:SS.cs"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        cs = int((seconds - int(seconds)) * 100)
        return f"{hours}:{minutes:02d}:{secs:02d}.{cs:02d}"

    def generate_ass(self, segments: List[Dict[str, Any]], style_name: str = "bold") -> str:
        """
        Generates an Advanced SubStation Alpha (.ass) subtitle string with word-level highlighting.
        """
        style = self.STYLES.get(style_name, self.STYLES["bold"])

        ass_header = f"""[Script Info]
Title: Casper Shorts Dynamic Captions
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: None
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{style['font']},{style['size'] * 2},{style['color']},&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,{style['outline'] * 2},0,2,20,20,{style['margin_v'] * 3},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
        events = []
        for seg in segments:
            start_str = self.format_timestamp_ass(seg.get("start", 0))
            end_str = self.format_timestamp_ass(seg.get("end", 0))
            words = seg.get("words", [])

            if words:
                # Word-level karaoke line
                karaoke_text = ""
                for w in words:
                    dur_cs = int((w.get("end", 0) - w.get("start", 0)) * 100)
                    dur_cs = max(10, dur_cs)
                    karaoke_text += f"{{\\k{dur_cs}}}{w.get('word', '')} "
                events.append(f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{karaoke_text.strip()}")
            else:
                events.append(f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{seg.get('text', '')}")

        return ass_header + "\n".join(events) + "\n"

