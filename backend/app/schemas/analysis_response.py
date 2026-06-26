from pydantic import BaseModel, ConfigDict


class AnalysisResponse(BaseModel):
    job_id: str

    original_log: str

    cleaned_log: str

    error_type: str | None

    root_cause: str | None

    explanation: str | None

    fix_suggestion: str | None

    fix_command: str | None

    model_config = ConfigDict(
        from_attributes=True
    )