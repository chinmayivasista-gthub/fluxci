from pydantic import BaseModel

from app.schemas.analysis_response import (
    AnalysisResponse,
)


class JobResponse(BaseModel):
    job_id: str

    status: str

    analysis: AnalysisResponse | None