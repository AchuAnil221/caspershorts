"""
Application configuration using pydantic-settings.
All settings are loaded from environment variables or .env file.
"""
from functools import lru_cache
from typing import List, Optional

import os
from pydantic import AnyHttpUrl, field_validator

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseModel as BaseSettings
    def SettingsConfigDict(**kwargs):
        return kwargs


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ────────────────────────────────────────────────────────────────────
    app_name: str = "Casper Shorts"
    app_env: str = "development"
    debug: bool = False
    secret_key: str = "change-me-in-production"
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"
    allowed_origins: str = "http://localhost:3000,http://localhost:8000"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    # ── Database ───────────────────────────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://casper:casper_password@localhost:5432/casper_shorts"
    database_pool_size: int = 10
    database_max_overflow: int = 20

    # ── Supabase ───────────────────────────────────────────────────────────────
    next_public_supabase_url: str = ""
    next_public_supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""

    @property
    def supabase_url(self) -> str:
        return self.next_public_supabase_url

    @property
    def supabase_anon_key(self) -> str:
        return self.next_public_supabase_anon_key

    # ── Redis / Celery ─────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    # ── Storage ────────────────────────────────────────────────────────────────
    storage_provider: str = "local"  # s3 | r2 | local
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "ap-south-1"
    s3_bucket_name: str = "casper-shorts-videos"
    s3_bucket_clips: str = "casper-shorts-clips"
    r2_account_id: Optional[str] = None
    r2_access_key_id: Optional[str] = None
    r2_secret_access_key: Optional[str] = None
    r2_bucket_name: Optional[str] = None
    r2_public_url: Optional[str] = None
    local_storage_path: str = "/tmp/casper-shorts/uploads"
    local_storage_url: str = "http://localhost:8000/static"

    # ── OpenAI ─────────────────────────────────────────────────────────────────
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4o"
    openai_whisper_model: str = "whisper-1"

    # ── Payments ───────────────────────────────────────────────────────────────
    stripe_secret_key: Optional[str] = None
    stripe_publishable_key: Optional[str] = None
    stripe_webhook_secret: Optional[str] = None
    stripe_price_pro_monthly: Optional[str] = None
    stripe_price_business_monthly: Optional[str] = None

    razorpay_key_id: Optional[str] = None
    razorpay_key_secret: Optional[str] = None
    razorpay_webhook_secret: Optional[str] = None
    razorpay_plan_pro: Optional[str] = None
    razorpay_plan_business: Optional[str] = None

    # ── YouTube ────────────────────────────────────────────────────────────────
    youtube_api_key: Optional[str] = None

    # ── Email ──────────────────────────────────────────────────────────────────
    email_provider: str = "smtp"
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    email_from: str = "noreply@caspershorts.com"
    email_from_name: str = "Casper Shorts"
    sendgrid_api_key: Optional[str] = None
    resend_api_key: Optional[str] = None

    # ── Monitoring ─────────────────────────────────────────────────────────────
    sentry_dsn: Optional[str] = None
    log_level: str = "INFO"

    # ── Plan Limits ───────────────────────────────────────────────────────────
    free_plan_minutes: int = 30
    pro_plan_minutes: int = 300
    business_plan_minutes: int = 1000
    free_plan_clips_per_month: int = 10
    pro_plan_clips_per_month: int = 100
    business_plan_clips_per_month: int = 500


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()


settings = get_settings()
