"""Videos router: upload, YouTube validation, and metadata retrieval."""
import re
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config import settings
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.models.video import Video
from app.schemas.video import VideoResponse, VideoUploadResponse, YouTubeMetadata, YouTubeValidateRequest
from app.services.auth_middleware import get_current_user
from app.services.storage import storage_service

router = APIRouter(prefix="/videos", tags=["Videos"])

ALLOWED_CONTENT_TYPES = {"video/mp4", "video/quicktime"}
MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024  # 2 GB


@router.post("/upload", response_model=VideoUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_video(
    project_id: UUID = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> VideoUploadResponse:
    """Handle multipart video upload (MP4/MOV), store in S3/R2, return upload info."""
    # Validate MIME type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Only MP4 and MOV files are supported",
        )

    # Validate project ownership
    proj_result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = proj_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Read file
    file_data = await file.read()
    if len(file_data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File exceeds 2 GB limit")

    # Upload to storage
    file_key = storage_service.generate_file_key(f"videos/{current_user.id}", file.filename or "upload.mp4")
    file_url = await storage_service.upload_file(file_data, file_key, file.content_type or "video/mp4")

    # Persist Video record
    video = Video(
        project_id=project_id,
        file_url=file_url,
        file_key=file_key,
        file_size=len(file_data),
        format=(file.filename or "").rsplit(".", 1)[-1].lower() or "mp4",
    )
    db.add(video)

    # Update project status
    project.status = "uploading"
    db.add(project)
    await db.commit()
    await db.refresh(video)

    return VideoUploadResponse(
        video_id=video.id,
        file_key=file_key,
        message="Video uploaded successfully. Start processing when ready.",
    )


@router.post("/validate-youtube", response_model=YouTubeMetadata)
async def validate_youtube(
    payload: YouTubeValidateRequest,
    current_user: User = Depends(get_current_user),
) -> YouTubeMetadata:
    """Validate a YouTube URL and fetch public video metadata."""
    # Extract video ID from URL
    yt_patterns = [
        r"youtu\.be/([a-zA-Z0-9_-]{11})",
        r"youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})",
        r"youtube\.com/shorts/([a-zA-Z0-9_-]{11})",
    ]
    video_id = None
    for pattern in yt_patterns:
        match = re.search(pattern, payload.url)
        if match:
            video_id = match.group(1)
            break

    if not video_id:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid YouTube URL")

    if not settings.YOUTUBE_API_KEY:
        # Return minimal valid response if API key not configured
        return YouTubeMetadata(url=payload.url, title="Unknown (API key not configured)", valid=True)

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params={"part": "snippet,contentDetails", "id": video_id, "key": settings.YOUTUBE_API_KEY},
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="YouTube API error")

    data = resp.json()
    items = data.get("items", [])
    if not items:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="YouTube video not found or is private")

    snippet = items[0].get("snippet", {})
    details = items[0].get("contentDetails", {})

    # Parse ISO 8601 duration to seconds
    duration_str = details.get("duration", "")
    duration_seconds = _parse_iso_duration(duration_str)

    return YouTubeMetadata(
        url=payload.url,
        title=snippet.get("title", ""),
        duration=duration_seconds,
        thumbnail=snippet.get("thumbnails", {}).get("high", {}).get("url"),
        channel=snippet.get("channelTitle"),
        valid=True,
    )


@router.get("/{video_id}/metadata", response_model=VideoResponse)
async def get_video_metadata(
    video_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> VideoResponse:
    """Return stored metadata for a video belonging to the current user's projects."""
    result = await db.execute(
        select(Video)
        .join(Project, Video.project_id == Project.id)
        .where(Video.id == video_id, Project.user_id == current_user.id)
    )
    video = result.scalar_one_or_none()
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
    return video


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_iso_duration(duration: str) -> int:
    """Convert ISO 8601 duration string (e.g. PT1H2M3S) to seconds."""
    import re as _re
    match = _re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration)
    if not match:
        return 0
    hours, minutes, seconds = (int(v) if v else 0 for v in match.groups())
    return hours * 3600 + minutes * 60 + seconds
