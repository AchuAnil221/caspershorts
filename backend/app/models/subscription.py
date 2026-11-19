"""Subscription and UsageRecord SQLAlchemy models."""
import uuid
from sqlalchemy import Column, String, Enum, Integer, Float, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Subscription(Base):
    """Tracks a user's active subscription plan and payment references."""

    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    plan = Column(Enum("free", "pro", "business", name="subscription_plan"), nullable=False, default="free")
    status = Column(
        Enum("active", "inactive", "past_due", "canceled", name="subscription_status"),
        nullable=False,
        default="active",
    )
    stripe_subscription_id = Column(String, nullable=True, unique=True)
    razorpay_subscription_id = Column(String, nullable=True, unique=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user = relationship("User", back_populates="subscription")


class UsageRecord(Base):
    """Monthly usage counters per user."""

    __tablename__ = "usage_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    processing_minutes_used = Column(Float, nullable=False, default=0.0)
    clips_generated = Column(Integer, nullable=False, default=0)
    credits_remaining = Column(Integer, nullable=False, default=0)
    period_start = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    user = relationship("User", back_populates="usage_records")
