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
            "'npm install lodash --save'). For recognizable classes "
            "of failure — dependency version conflicts, corrupted "
            "installs, compiled-extension/ABI mismatches, stale "
            "build caches — suggest the standard, well-known "
            "remediation command engineers actually try first (for "
            "example 'pip install --force-reinstall <package>' for "
            "a native-extension symbol mismatch), even if it is not "
            "a guaranteed fix, since it is still genuinely useful "
            "advice. Only return 'N/A' when no standard command "
            "exists at all and the fix is purely a source-code "
            "change — do not return 'N/A' just because you are not "
            "100% certain a reasonable command will work."
        )
    )