from pydantic import BaseModel


class RuleResult(BaseModel):

    matched: bool

    error_type: str | None = None

    root_cause: str | None = None

    explanation: str | None = None

    fix_suggestion: str | None = None

    fix_command: str | None = None