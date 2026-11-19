"""Auth router: profile management backed by Supabase JWT."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth_middleware import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/profile", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def upsert_profile(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Get or create a user profile from the Supabase JWT.

    The middleware already handles creation on first login,
    so this endpoint simply returns the resolved user.
    """
    return current_user


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Return the authenticated user's profile."""
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Update mutable profile fields (name)."""
    if payload.name is not None:
        current_user.name = payload.name
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
