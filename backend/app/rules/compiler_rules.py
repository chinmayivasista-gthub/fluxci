import re

from app.schemas.rule_result import RuleResult


class CompilerRules:

    @staticmethod
    def compilation_failure(log: str) -> RuleResult:

        patterns = [
            # GCC / Clang style: file.c:10:5: error: message
            r"\S+:\d+:\d+:\s*(?:fatal\s+)?error:\s.*",
            # Rust style: error[E0308]: message
            r"\berror\[E\d+\]:\s.*",
            # TypeScript style: file.ts(42,19): error TS2339: message
            r"\(\d+,\d+\):\s*error\s+TS\d+:\s.*",
            r"\bcompilation terminated\b",
        ]

        for pattern in patterns:

            match = re.search(pattern, log, re.IGNORECASE)

            if match:

                message = match.group(0)

                return RuleResult(
                    matched=True,
                    error_type="Compilation Error",
                    root_cause="Compilation failed.",
                    explanation=message,
                    fix_suggestion=(
                        "Review the compiler error and correct "
                        "the source code."
                    ),
                    fix_command=None,
                )

        return RuleResult(matched=False)