from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
)

from app.database.base import Base


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    job_id = Column(
        String,
        unique=True,
        nullable=False,
    )

    # Overall job state
    status = Column(
        String,
        nullable=False,
        default="processing",
    )

    # Current pipeline stage
    current_step = Column(
        String,
        nullable=False,
        default="LOG_RECEIVED",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )