"""Pydantic schemas for Project endpoints."""
from datetime import datetime
from typing import Optional, Any, Dict
from uuid import UUID
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    source_type: str  # upload | youtube
    source_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = {}


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None


class ProjectResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    source_type: str
    source_url: Optional[str]
    duration: Optional[float]
    status: str
    settings: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectStatusResponse(BaseModel):
    project_id: UUID
    status: str
    job_id: Optional[str] = None
    progress: Optional[int] = None
    message: Optional[str] = None
