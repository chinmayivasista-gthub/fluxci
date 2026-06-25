import re

from app.schemas.rule_result import RuleResult


class CompilerRules:

    @staticmethod
    def compilation_failure(log: str) -> RuleResult:

        patterns = [
            r"error: .*",
            r"fatal error: .*",
            r"compilation terminated",
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
                        "Review the compiler error and correct the source code."
                    ),
                    fix_command=None,
                )

        return RuleResult(matched=False)