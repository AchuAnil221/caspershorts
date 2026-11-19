"""Pydantic schemas for Transcript endpoints."""
from datetime import datetime
from typing import Optional, Any, List
from uuid import UUID
from pydantic import BaseModel


class WordTimestamp(BaseModel):
    word: str
    start: float
    end: float
    confidence: Optional[float] = None


class TranscriptResponse(BaseModel):
    id: UUID
    video_id: UUID
    content: Optional[str]
    word_timestamps: Optional[List[Any]]
    language: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
