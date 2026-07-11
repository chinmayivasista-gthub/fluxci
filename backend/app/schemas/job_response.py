from pydantic import BaseModel

from app.schemas.analysis_response import AnalysisResponse


class JobResponse(BaseModel):

    job_id: str

    status: str

    current_step: str

    analysis: AnalysisResponse | None = None