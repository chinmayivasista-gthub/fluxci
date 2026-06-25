from pydantic import BaseModel


class FailureClassification(BaseModel):

    category: str

    severity: str

    confidence: float

    recoverable: bool

    requires_ai: bool

    summary: str