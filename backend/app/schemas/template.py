"""Pydantic schemas for BrandTemplate endpoints."""
from datetime import datetime
from typing import Optional, Any, Dict
from uuid import UUID
from pydantic import BaseModel


class TemplateCreate(BaseModel):
    name: str
    logo_url: Optional[str] = None
    colors: Optional[Dict[str, Any]] = {}
    caption_settings: Optional[Dict[str, Any]] = {}
    is_default: bool = False


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    colors: Optional[Dict[str, Any]] = None
    caption_settings: Optional[Dict[str, Any]] = None
    is_default: Optional[bool] = None


class TemplateResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    logo_url: Optional[str]
    colors: Optional[Dict[str, Any]]
    caption_settings: Optional[Dict[str, Any]]
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True
