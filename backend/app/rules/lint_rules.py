import re

from app.schemas.rule_result import RuleResult


class LintRules:

    @staticmethod
    def lint_failure(log: str) -> RuleResult:

        patterns = [
            r"flake8",
            r"pylint",
            r"eslint",
            r"style violations?",
            r"lint failed",
        ]

        for pattern in patterns:

            if re.search(pattern, log, re.IGNORECASE):

                return RuleResult(
                    matched=True,
                    error_type="Lint Failure",
                    root_cause="Code style or linting checks failed.",
                    explanation=(
                        "The source code violates one or more "
                        "linting or formatting rules."
                    ),
                    fix_suggestion=(
                        "Run the project's formatter or lint fixer "
                        "and correct the reported issues."
                    ),
                    fix_command=None,
                )

        return RuleResult(matched=False)