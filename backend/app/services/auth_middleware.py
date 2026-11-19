"""Auth middleware: verify Supabase JWT tokens and inject current user."""
from typing import Optional
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.config import settings
from app.database import get_db
from app.models.user import User

bearer_scheme = HTTPBearer()


async def _get_supabase_user(token: str) -> dict:
    """Decode and verify a Supabase JWT using the project JWT secret."""
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """FastAPI dependency — resolve Bearer token to a local User row.

    Creates the row on first login (profile sync from Supabase).
    """
    token = credentials.credentials
    payload = await _get_supabase_user(token)

    supabase_user_id: Optional[str] = payload.get("sub")
    if not supabase_user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    result = await db.execute(select(User).where(User.supabase_user_id == supabase_user_id))
    user = result.scalar_one_or_none()

    if user is None:
        # Auto-create profile on first login
        email = payload.get("email", "")
        name = (payload.get("user_metadata") or {}).get("full_name", "")
        user = User(supabase_user_id=supabase_user_id, email=email, name=name)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return user


async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """FastAPI dependency — requires current user to have admin role."""
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user
