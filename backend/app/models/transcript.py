"""Transcript SQLAlchemy model."""
import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class Transcript(Base):
    """Stores the full text transcript and word-level timestamps for a video."""

    __tablename__ = "transcripts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    video_id = Column(
        UUID(as_uuid=True), ForeignKey("videos.id", ondelete="CASCADE"), nullable=False, unique=True, index=True
    )
    content = Column(Text, nullable=True)
    word_timestamps = Column(JSONB, nullable=True)
    language = Column(String(10), nullable=True, default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    video = relationship("Video", back_populates="transcript")
