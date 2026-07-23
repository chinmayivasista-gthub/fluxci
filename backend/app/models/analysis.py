from sqlalchemy import Column, Integer, Text, String, DateTime
from datetime import datetime

from app.database.base import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)

    original_log = Column(Text, nullable=False)
    cleaned_log = Column(Text, nullable=True)

    error_type = Column(String, nullable=True)
    root_cause = Column(Text, nullable=True)

    explanation = Column(Text, nullable=True)

    fix_suggestion = Column(Text, nullable=True)
    fix_command = Column(Text, nullable=True)
    exit_code = Column(Integer, nullable=True)
    analysis_source = Column(
    String,
    nullable=False,
    )
    created_at = Column(
        DateTime,
        default=datetime.utcnow
        
    )
    job_id = Column(
         String,
         unique=True,
         nullable=False,
    )