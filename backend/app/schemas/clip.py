"""Pydantic schemas for Clip endpoints."""
from datetime import datetime
from typing import Optional, Any, Dict, List
from uuid import UUID
from pydantic import BaseModel


class ClipUpdate(BaseModel):
    title: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    aspect_ratio: Optional[str] = None
    platform: Optional[str] = None


class ClipExportRequest(BaseModel):
    aspect_ratio: Optional[str] = "9:16"
    platform: Optional[str] = None
    settings: Optional[Dict[str, Any]] = {}


class ClipResponse(BaseModel):
    id: UUID
    project_id: UUID
    start_time: float
    end_time: float
    title: Optional[str]
    ai_score: Optional[float]
    rendered_url: Optional[str]
    thumbnail_url: Optional[str]
    status: str
    aspect_ratio: str
    platform: Optional[str]
    caption_status: str
    settings: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClipDownloadResponse(BaseModel):
    clip_id: UUID
    download_url: str
    expires_in: int  # seconds


class ZipDownloadRequest(BaseModel):
    clip_ids: List[UUID]


class ZipDownloadResponse(BaseModel):
    zip_url: str
    expires_in: int
