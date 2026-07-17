from pydantic import BaseModel, Field


class GeminiResponse(BaseModel):

    error_type: str = Field(
        description=(
            "A short, specific label for the failure category, "
            "e.g. 'Missing Environment Variable', 'Type Error', "
            "'Failed Database Migration'. Avoid vague labels like "
            "'Error' or 'Build Failed'."
        )
    )

    root_cause: str = Field(
        description=(
            "One or two plain-English sentences stating exactly what "
            "went wrong and where (file, package, command, or service "
            "name if visible in the log). No hedging or filler."
        )
    )

    explanation: str = Field(
        description=(
            "A clear, well-structured explanation a mid-level engineer "
            "would find genuinely helpful: what triggered the failure, "
            "why it happened, and any relevant context from the log. "
            "Write in plain English, short sentences, no unnecessary "
            "jargon. If there is more than one distinct finding (a "
            "primary failure plus any secondary ones), format them as "
            "a numbered list separated by newline characters, one "
            "finding per line. Otherwise write 2-4 plain sentences."
        )
    )

    fix_suggestion: str = Field(
        description=(
            "A specific, actionable description of how to resolve the "
            "issue. Reference the exact package, file, config key, or "
            "setting involved. Avoid generic advice like 'check your "
            "code' or 'review the configuration'. If there is more "
            "than one distinct issue to fix, format them as a "
            "numbered list separated by newline characters, one fix "
            "per line."
        )
    )

    fix_command: str = Field(
        description=(
            "The exact, ready-to-run terminal command that resolves "
            "the issue (e.g. 'pip install requests', "
            "'npm install lodash --save'). If no single command can "
            "fix this and a code change is required instead, return "
            "'N/A' rather than inventing a command."
        )
    )