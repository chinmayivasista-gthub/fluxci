import re

from app.schemas.rule_result import RuleResult


class TestRules:

    @staticmethod
    def test_failure(log: str) -> RuleResult:

        patterns = [
            r"AssertionError",
            r"\d+\s+failed",
            r"FAILED\s+.*",
            r"Test Failed",
        ]

        for pattern in patterns:

            if re.search(pattern, log, re.IGNORECASE):

                return RuleResult(
                    matched=True,
                    error_type="Test Failure",
                    root_cause="One or more automated tests failed.",
                    explanation=(
                        "The project built successfully, but one "
                        "or more test cases did not pass."
                    ),
                    fix_suggestion=(
                        "Review the failing test cases and update "
                        "either the implementation or the tests."
                    ),
                    fix_command=None,
                )

        return RuleResult(matched=False)