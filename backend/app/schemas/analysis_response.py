from datetime import datetime

from pydantic import BaseModel


class AnalysisResponse(BaseModel):

    id: int

    job_id: str

    error_type: str

    root_cause: str

    explanation: str

    fix_suggestion: str

    fix_command: str | None

    analysis_source: str

    created_at: datetime

    class Config:
        from_attributes = True