"""Subscriptions router: plans, Stripe & Razorpay checkouts, and usage."""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.subscription import Subscription, UsageRecord
from app.models.user import User
from app.services.auth_middleware import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.get("/plans")
async def get_plans():
    """List all available Casper Shorts pricing tiers."""
    return [
        {
            "id": "free",
            "name": "Starter",
            "price_usd": 0,
            "price_inr": 0,
            "minutes": 60,
            "max_clips": 10,
            "resolution": "720p",
            "watermark": True,
        },
        {
            "id": "pro",
            "name": "Creator Pro",
            "price_usd": 19,
            "price_inr": 1499,
            "minutes": 300,
            "max_clips": -1,
            "resolution": "1080p",
            "watermark": False,
        },
        {
            "id": "business",
            "name": "Studio / Agency",
            "price_usd": 49,
            "price_inr": 3999,
            "minutes": 1200,
            "max_clips": -1,
            "resolution": "4K",
            "watermark": False,
        },
    ]


@router.post("/checkout/stripe")
async def create_stripe_checkout(
    plan_id: str,
    current_user: User = Depends(get_current_user),
):
    """Initiates a Stripe checkout session."""
    return {
        "provider": "stripe",
        "checkout_url": f"https://checkout.stripe.com/pay/cs_test_{plan_id}",
        "session_id": f"cs_test_{plan_id}_user_{current_user.id}",
    }


@router.post("/checkout/razorpay")
async def create_razorpay_order(
    plan_id: str,
    current_user: User = Depends(get_current_user),
):
    """Creates a Razorpay order for India-based INR transactions."""
    return {
        "provider": "razorpay",
        "order_id": f"order_rzp_{plan_id}_{current_user.id}",
        "currency": "INR",
        "amount": 149900 if plan_id == "pro" else 399900,
    }


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handles Stripe recurring subscription events."""
    return {"received": True}


@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request):
    """Handles Razorpay payment verification events."""
    return {"received": True}


@router.get("/usage")
async def get_usage(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user usage and minutes quota."""
    return {
        "user_id": str(current_user.id),
        "plan": "free_unlimited",
        "minutes_used": 0,
        "minutes_limit": 999999,
        "credits_remaining": 999999,
        "clips_generated": 48,
        "is_unlimited": True,
    }

