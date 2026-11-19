"""Video SQLAlchemy model."""
import uuid
from sqlalchemy import Column, String, Float, BigInteger, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Video(Base):
    """Stores metadata for uploaded or linked video files."""

    __tablename__ = "videos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True, index=True
    )
    file_url = Column(String, nullable=True)
    file_key = Column(String, nullable=True)
    file_size = Column(BigInteger, nullable=True)
    duration = Column(Float, nullable=True)
    format = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    project = relationship("Project", back_populates="video")
    transcript = relationship("Transcript", back_populates="video", uselist=False, cascade="all, delete-orphan")
