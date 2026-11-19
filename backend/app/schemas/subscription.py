"""Pydantic schemas for Subscription endpoints."""
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel


class PlanFeature(BaseModel):
    name: str
    included: bool


class PlanResponse(BaseModel):
    id: str  # free | pro | business
    name: str
    price_inr: int
    price_usd: int
    features: List[str]
    limits: dict


class SubscriptionResponse(BaseModel):
    id: UUID
    user_id: UUID
    plan: str
    status: str
    stripe_subscription_id: Optional[str]
    razorpay_subscription_id: Optional[str]
    current_period_end: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class CheckoutRequest(BaseModel):
    plan: str  # pro | business
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class RazorpayCheckoutRequest(BaseModel):
    plan: str


class UsageResponse(BaseModel):
    plan: str
    processing_minutes_used: float
    processing_minutes_limit: float
    clips_generated: int
    clips_limit: int
    credits_remaining: int


class AdjustCreditsRequest(BaseModel):
    delta: int
    reason: Optional[str] = None
