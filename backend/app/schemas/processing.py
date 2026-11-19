"""Pydantic schemas for processing/pipeline endpoints."""
from typing import Optional, Any, Dict
from uuid import UUID
from pydantic import BaseModel


class ProcessingStartResponse(BaseModel):
    job_id: str
    project_id: UUID
    message: str


class JobStatusResponse(BaseModel):
    job_id: str
    state: str  # PENDING | STARTED | PROGRESS | SUCCESS | FAILURE
    progress: Optional[int] = None
    current_step: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class RegenerateRequest(BaseModel):
    settings: Optional[Dict[str, Any]] = {}
    aspect_ratio: Optional[str] = "9:16"
