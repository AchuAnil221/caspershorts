"""GeneratedClip SQLAlchemy model."""
import uuid
from sqlalchemy import Column, String, Float, Enum, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class GeneratedClip(Base):
    """An AI-generated short clip extracted from a project's video."""

    __tablename__ = "generated_clips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    title = Column(String, nullable=True)
    ai_score = Column(Float, nullable=True)
    rendered_url = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    status = Column(
        Enum("pending", "rendering", "ready", "failed", name="clip_status"),
        nullable=False,
        default="pending",
    )
    aspect_ratio = Column(
        Enum("9:16", "1:1", "16:9", name="aspect_ratio"), nullable=False, default="9:16"
    )
    platform = Column(
        Enum("tiktok", "instagram", "youtube_shorts", "twitter", name="platform"), nullable=True
    )
    caption_status = Column(
        Enum("none", "pending", "done", name="caption_status"), nullable=False, default="none"
    )
    settings = Column(JSONB, nullable=True, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    project = relationship("Project", back_populates="clips")
