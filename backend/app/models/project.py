"""Project SQLAlchemy model."""
import uuid
from sqlalchemy import Column, String, Enum, DateTime, Float, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class Project(Base):
    """Represents a user video project (upload or YouTube source)."""

    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    source_type = Column(Enum("upload", "youtube", name="source_type"), nullable=False)
    source_url = Column(String, nullable=True)
    duration = Column(Float, nullable=True)
    status = Column(
        Enum("pending", "uploading", "processing", "completed", "failed", name="project_status"),
        nullable=False,
        default="pending",
    )
    settings = Column(JSONB, nullable=True, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="projects")
    video = relationship("Video", back_populates="project", uselist=False, cascade="all, delete-orphan")
    clips = relationship("GeneratedClip", back_populates="project", cascade="all, delete-orphan")
