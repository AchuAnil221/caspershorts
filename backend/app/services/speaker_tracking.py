"""
Speaker Tracking Service
Uses OpenCV for facial detection to keep active speakers centered in 9:16 vertical video crops.
Includes reliable center-crop fallback.
"""

import logging
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger(__name__)


class SpeakerTracker:
    """Detects speakers and computes dynamic crop bounding boxes."""

    def __init__(self):
        self._cascade = None

    def _get_cascade(self):
        if self._cascade is not None:
            return self._cascade
        try:
            import cv2
            cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            self._cascade = cv2.CascadeClassifier(cascade_path)
        except Exception as e:
            logger.warning("Could not initialize OpenCV Haar cascade: %s. Using center-crop fallback.", e)
            self._cascade = None
        return self._cascade

    def calculate_crop_box(
        self,
        frame_width: int,
        frame_height: int,
        target_ratio: str = "9:16",
        detected_face: Optional[Tuple[int, int, int, int]] = None,
    ) -> Dict[str, int]:
        """
        Calculates optimal crop box (x, y, width, height) to convert to target aspect ratio.
        """
        if target_ratio == "9:16":
            crop_width = int(frame_height * (9 / 16))
            crop_height = frame_height

            if crop_width > frame_width:
                crop_width = frame_width
                crop_height = int(frame_width * (16 / 9))

            if detected_face:
                fx, fy, fw, fh = detected_face
                face_center_x = fx + (fw // 2)
                crop_x = face_center_x - (crop_width // 2)
                # Clamp within boundaries
                crop_x = max(0, min(crop_x, frame_width - crop_width))
            else:
                # Center crop fallback
                crop_x = (frame_width - crop_width) // 2

            crop_y = (frame_height - crop_height) // 2
            return {"x": crop_x, "y": crop_y, "width": crop_width, "height": crop_height}

        elif target_ratio == "1:1":
            dim = min(frame_width, frame_height)
            crop_x = (frame_width - dim) // 2
            crop_y = (frame_height - dim) // 2
            return {"x": crop_x, "y": crop_y, "width": dim, "height": dim}

        else:  # 16:9
            return {"x": 0, "y": 0, "width": frame_width, "height": frame_height}

