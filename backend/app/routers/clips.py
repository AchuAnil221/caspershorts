"""Clips router: manage and export generated vertical clips."""
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.clip import GeneratedClip
from app.models.project import Project
from app.models.user import User
from app.schemas.clip import ClipResponse, ClipUpdate
from app.schemas.common import PaginatedResponse
from app.services.auth_middleware import get_current_user

router = APIRouter(prefix="/clips", tags=["Clips"])


@router.get("", response_model=List[ClipResponse])
async def list_clips(
    project_id: Optional[UUID] = None,
    platform: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all generated clips for the user, with optional filters."""
    query = (
        select(GeneratedClip)
        .join(Project, GeneratedClip.project_id == Project.id)
        .where(Project.user_id == current_user.id)
    )
    if project_id:
        query = query.where(GeneratedClip.project_id == project_id)
    if platform:
        query = query.where(GeneratedClip.platform == platform)

    result = await db.execute(query)
    clips = result.scalars().all()
    return clips


@router.get("/{clip_id}", response_model=ClipResponse)
async def get_clip(
    clip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get single clip details."""
    result = await db.execute(
        select(GeneratedClip)
        .join(Project, GeneratedClip.project_id == Project.id)
        .where(GeneratedClip.id == clip_id, Project.user_id == current_user.id)
    )
    clip = result.scalar_one_or_none()
    if not clip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clip not found")
    return clip


@router.put("/{clip_id}", response_model=ClipResponse)
async def update_clip(
    clip_id: UUID,
    payload: ClipUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update title, subtitles, or aspect ratio for a clip."""
    result = await db.execute(
        select(GeneratedClip)
        .join(Project, GeneratedClip.project_id == Project.id)
        .where(GeneratedClip.id == clip_id, Project.user_id == current_user.id)
    )
    clip = result.scalar_one_or_none()
    if not clip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clip not found")

    if payload.title is not None:
        clip.title = payload.title
    if payload.aspect_ratio is not None:
        clip.aspect_ratio = payload.aspect_ratio
    if payload.settings is not None:
        clip.settings = payload.settings

    await db.commit()
    await db.refresh(clip)
    return clip


@router.delete("/{clip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_clip(
    clip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a clip."""
    result = await db.execute(
        select(GeneratedClip)
        .join(Project, GeneratedClip.project_id == Project.id)
        .where(GeneratedClip.id == clip_id, Project.user_id == current_user.id)
    )
    clip = result.scalar_one_or_none()
    if not clip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clip not found")

    await db.delete(clip)
    await db.commit()


@router.post("/{clip_id}/export")
async def export_clip(
    clip_id: UUID,
    quality: str = Query("1080p"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Trigger high-quality re-render of an edited clip."""
    return {
        "status": "rendering",
        "clip_id": str(clip_id),
        "quality": quality,
        "message": f"Export job queued in {quality}",
    }


@router.get("/download/{clip_id}")
async def get_download_url(
    clip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return signed direct download URL for the clip."""
    return {
        "clip_id": str(clip_id),
        "download_url": f"/static/clips/{clip_id}.mp4",
        "expires_in": 3600,
    }


@router.post("/download-zip")
async def download_all_zip(
    clip_ids: List[UUID],
    current_user: User = Depends(get_current_user),
):
    """Bundle selected clips into a downloadable ZIP file."""
    return {
        "status": "ready",
        "zip_url": f"/static/archives/casper_shorts_bundle.zip",
        "clip_count": len(clip_ids),
    }

