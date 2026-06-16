from pydantic import BaseModel
from typing import Optional


class AnalysisCreate(BaseModel):
    log: str


class AnalysisResponse(BaseModel):
    id: int

    error_type: Optional[str] = None
    root_cause: Optional[str] = None
    explanation: Optional[str] = None

    fix_suggestion: Optional[str] = None
    fix_command: Optional[str] = None