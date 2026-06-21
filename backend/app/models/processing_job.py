from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.base import Base


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(Integer, primary_key=True, index=True)

    job_id = Column(String, unique=True, nullable=False)

    status = Column(String, nullable=False, default="processing")

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )