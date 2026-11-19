"""BrandTemplate SQLAlchemy model."""
import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class BrandTemplate(Base):
    """User-defined brand template for clip rendering."""

    __tablename__ = "brand_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    colors = Column(JSONB, nullable=True, default=dict)
    caption_settings = Column(JSONB, nullable=True, default=dict)
    is_default = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="brand_templates")
