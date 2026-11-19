"""Pydantic schemas for Video endpoints."""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class VideoResponse(BaseModel):
    id: UUID
    project_id: UUID
    file_url: Optional[str]
    file_key: Optional[str]
    file_size: Optional[int]
    duration: Optional[float]
    format: Optional[str]
    thumbnail_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class VideoUploadResponse(BaseModel):
    video_id: UUID
    upload_url: Optional[str] = None
    file_key: str
    message: str


class YouTubeValidateRequest(BaseModel):
    url: str


class YouTubeMetadata(BaseModel):
    url: str
    title: str
    duration: Optional[int]
    thumbnail: Optional[str]
    channel: Optional[str]
    valid: bool
