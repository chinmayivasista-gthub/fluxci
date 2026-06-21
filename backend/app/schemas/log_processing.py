from pydantic import BaseModel


class LogProcessingResult(BaseModel):

    cleaned_log: str

    error_block: str

    stack_trace: str | None

    exit_code: int | None

    failure_section: str