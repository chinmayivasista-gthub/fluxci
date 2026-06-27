from pydantic import BaseModel


class GeminiResponse(BaseModel):

    error_type: str

    root_cause: str

    explanation: str

    fix_suggestion: str

    fix_command: str