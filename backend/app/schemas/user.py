"""Pydantic schemas for User endpoints."""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: Optional[str] = None
    email: EmailStr


class UserCreate(UserBase):
    supabase_user_id: str


class UserUpdate(BaseModel):
    name: Optional[str] = None


class UserResponse(UserBase):
    id: UUID
    supabase_user_id: str
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
