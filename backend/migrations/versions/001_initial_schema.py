"""
Alembic migration: 001_initial_schema
Full database schema for Casper Shorts.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Enable extensions ─────────────────────────────────────────────────────
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "pg_trgm"')

    # ── ENUM types ────────────────────────────────────────────────────────────
    user_role = postgresql.ENUM("user", "admin", name="user_role", create_type=True)
    user_role.create(op.get_bind(), checkfirst=True)

    source_type = postgresql.ENUM("upload", "youtube", name="source_type", create_type=True)
    source_type.create(op.get_bind(), checkfirst=True)

    project_status = postgresql.ENUM(
        "pending", "queued", "processing", "completed", "failed",
        name="project_status", create_type=True
    )
    project_status.create(op.get_bind(), checkfirst=True)

    clip_status = postgresql.ENUM(
        "pending", "rendering", "completed", "failed",
        name="clip_status", create_type=True
    )
    clip_status.create(op.get_bind(), checkfirst=True)

    caption_status = postgresql.ENUM(
        "none", "pending", "completed", "failed",
        name="caption_status", create_type=True
    )
    caption_status.create(op.get_bind(), checkfirst=True)

    aspect_ratio = postgresql.ENUM(
        "9:16", "1:1", "16:9",
        name="aspect_ratio", create_type=True
    )
    aspect_ratio.create(op.get_bind(), checkfirst=True)

    platform = postgresql.ENUM(
        "tiktok", "instagram", "youtube_shorts", "twitter", "linkedin",
        name="platform", create_type=True
    )
    platform.create(op.get_bind(), checkfirst=True)

    subscription_plan = postgresql.ENUM(
        "free", "pro", "business",
        name="subscription_plan", create_type=True
    )
    subscription_plan.create(op.get_bind(), checkfirst=True)

    subscription_status = postgresql.ENUM(
        "active", "past_due", "cancelled", "trialing",
        name="subscription_status", create_type=True
    )
    subscription_status.create(op.get_bind(), checkfirst=True)

    # ── users ─────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("supabase_user_id", sa.String(255), nullable=False, unique=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("avatar_url", sa.Text, nullable=True),
        sa.Column("role", postgresql.ENUM("user", "admin", name="user_role", create_type=False),
                  nullable=False, server_default="user"),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  onupdate=sa.text("NOW()"), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_supabase_user_id", "users", ["supabase_user_id"])

    # ── subscriptions ─────────────────────────────────────────────────────────
    op.create_table(
        "subscriptions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("plan",
                  postgresql.ENUM("free", "pro", "business", name="subscription_plan",
                                  create_type=False),
                  nullable=False, server_default="free"),
        sa.Column("status",
                  postgresql.ENUM("active", "past_due", "cancelled", "trialing",
                                  name="subscription_status", create_type=False),
                  nullable=False, server_default="active"),
        sa.Column("stripe_subscription_id", sa.String(255), nullable=True, unique=True),
        sa.Column("stripe_customer_id", sa.String(255), nullable=True),
        sa.Column("razorpay_subscription_id", sa.String(255), nullable=True, unique=True),
        sa.Column("current_period_start", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("current_period_end", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("cancel_at_period_end", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
    )
    op.create_index("ix_subscriptions_user_id", "subscriptions", ["user_id"])

    # ── usage_records ─────────────────────────────────────────────────────────
    op.create_table(
        "usage_records",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("processing_minutes_used", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("clips_generated", sa.Integer, nullable=False, server_default="0"),
        sa.Column("credits_remaining", sa.Integer, nullable=False, server_default="0"),
        sa.Column("period_start", sa.TIMESTAMP(timezone=True), server_default=sa.text("date_trunc('month', NOW())"),
                  nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
    )

    # ── brand_templates ───────────────────────────────────────────────────────
    op.create_table(
        "brand_templates",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("logo_url", sa.Text, nullable=True),
        sa.Column("colors", postgresql.JSONB, nullable=False,
                  server_default='{"primary": "#2563EB", "secondary": "#1E40AF"}'),
        sa.Column("caption_settings", postgresql.JSONB, nullable=False,
                  server_default='{"style": "minimal", "position": "bottom", "font": "Arial"}'),
        sa.Column("is_default", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
    )
    op.create_index("ix_brand_templates_user_id", "brand_templates", ["user_id"])

    # ── projects ──────────────────────────────────────────────────────────────
    op.create_table(
        "projects",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(500), nullable=False),
        sa.Column("source_type",
                  postgresql.ENUM("upload", "youtube", name="source_type", create_type=False),
                  nullable=False),
        sa.Column("source_url", sa.Text, nullable=True),
        sa.Column("duration", sa.Numeric(10, 2), nullable=True),
        sa.Column("status",
                  postgresql.ENUM("pending", "queued", "processing", "completed", "failed",
                                  name="project_status", create_type=False),
                  nullable=False, server_default="pending"),
        sa.Column("celery_task_id", sa.String(255), nullable=True),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("settings", postgresql.JSONB, nullable=False,
                  server_default='{"aspect_ratios": ["9:16"], "max_clips": 10, "min_clip_duration": 30, "max_clip_duration": 90}'),
        sa.Column("brand_template_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("brand_templates.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
    )
    op.create_index("ix_projects_user_id", "projects", ["user_id"])
    op.create_index("ix_projects_status", "projects", ["status"])
    op.create_index("ix_projects_created_at", "projects", ["created_at"])

    # ── videos ────────────────────────────────────────────────────────────────
    op.create_table(
        "videos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("project_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("file_url", sa.Text, nullable=False),
        sa.Column("file_key", sa.String(1000), nullable=False),
        sa.Column("file_size", sa.BigInteger, nullable=True),
        sa.Column("duration", sa.Numeric(10, 2), nullable=True),
        sa.Column("format", sa.String(20), nullable=True),
        sa.Column("resolution", sa.String(20), nullable=True),
        sa.Column("fps", sa.Numeric(5, 2), nullable=True),
        sa.Column("thumbnail_url", sa.Text, nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
    )
    op.create_index("ix_videos_project_id", "videos", ["project_id"])

    # ── transcripts ───────────────────────────────────────────────────────────
    op.create_table(
        "transcripts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("video_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("videos.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("word_timestamps", postgresql.JSONB, nullable=True),
        sa.Column("language", sa.String(10), nullable=True, server_default="en"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
    )

    # ── generated_clips ───────────────────────────────────────────────────────
    op.create_table(
        "generated_clips",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()")),
        sa.Column("project_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("start_time", sa.Numeric(10, 3), nullable=False),
        sa.Column("end_time", sa.Numeric(10, 3), nullable=False),
        sa.Column("title", sa.String(500), nullable=True),
        sa.Column("ai_score", sa.Numeric(5, 2), nullable=True),
        sa.Column("ai_reasoning", sa.Text, nullable=True),
        sa.Column("rendered_url", sa.Text, nullable=True),
        sa.Column("file_key", sa.String(1000), nullable=True),
        sa.Column("thumbnail_url", sa.Text, nullable=True),
        sa.Column("status",
                  postgresql.ENUM("pending", "rendering", "completed", "failed",
                                  name="clip_status", create_type=False),
                  nullable=False, server_default="pending"),
        sa.Column("aspect_ratio",
                  postgresql.ENUM("9:16", "1:1", "16:9", name="aspect_ratio", create_type=False),
                  nullable=False, server_default="9:16"),
        sa.Column("platform",
                  postgresql.ENUM("tiktok", "instagram", "youtube_shorts", "twitter", "linkedin",
                                  name="platform", create_type=False),
                  nullable=True),
        sa.Column("caption_status",
                  postgresql.ENUM("none", "pending", "completed", "failed",
                                  name="caption_status", create_type=False),
                  nullable=False, server_default="none"),
        sa.Column("settings", postgresql.JSONB, nullable=False,
                  server_default='{"caption_style": "minimal", "export_quality": "1080p"}'),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("NOW()"),
                  nullable=False),
    )
    op.create_index("ix_generated_clips_project_id", "generated_clips", ["project_id"])
    op.create_index("ix_generated_clips_status", "generated_clips", ["status"])
    op.create_index("ix_generated_clips_ai_score", "generated_clips", ["ai_score"])


def downgrade() -> None:
    op.drop_table("generated_clips")
    op.drop_table("transcripts")
    op.drop_table("videos")
    op.drop_table("projects")
    op.drop_table("brand_templates")
    op.drop_table("usage_records")
    op.drop_table("subscriptions")
    op.drop_table("users")

    # Drop ENUMs
    for enum_name in [
        "subscription_status", "subscription_plan", "platform", "aspect_ratio",
        "caption_status", "clip_status", "project_status", "source_type", "user_role",
    ]:
        op.execute(f"DROP TYPE IF EXISTS {enum_name}")
