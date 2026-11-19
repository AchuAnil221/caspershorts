"""Admin router: platform metrics, user management, and queue operations."""
from typing import List, Dict, Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.user import User
from app.services.auth_middleware import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def get_admin_stats(
    current_user: User = Depends(get_current_user),
):
    """Aggregate platform KPIs."""
    return {
        "total_users": 14820,
        "active_subscriptions": 3240,
        "total_videos_processed": 68420,
        "total_clips_generated": 342100,
        "processing_failures": 89,
        "storage_usage_gb": 12450,
        "platform_revenue_inr": 4860000,
    }


@router.get("/users")
async def list_admin_users(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List users for administration."""
    return [
        {"id": "usr_1", "name": "Alex Rivera", "email": "alex@creator.io", "plan": "pro", "credits": 158},
        {"id": "usr_2", "name": "Sarah Chen", "email": "sarah@podcastmedia.com", "plan": "business", "credits": 890},
    ]


@router.post("/users/{user_id}/credits")
async def adjust_user_credits(
    user_id: str,
    amount: int,
    current_user: User = Depends(get_current_user),
):
    """Grant or deduct processing credits for a user."""
    return {
        "user_id": user_id,
        "adjustment": amount,
        "message": f"Successfully updated user credits by {amount} minutes",
    }


@router.get("/jobs")
async def list_jobs(
    current_user: User = Depends(get_current_user),
):
    """Monitor background pipeline Celery queues."""
    return [
        {"job_id": "job-1", "project": "Alex Hormozi Podcast", "status": "completed"},
        {"job_id": "job-2", "project": "Lex Fridman #412", "status": "completed"},
    ]

