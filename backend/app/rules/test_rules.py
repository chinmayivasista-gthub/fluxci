import re

from app.schemas.rule_result import RuleResult


class TestRules:

    @staticmethod
    def test_failure(log: str) -> RuleResult:

        # Look for the specific failing test first (pytest / Jest
        # formats) — naming the actual test is far more useful to
        # someone debugging than a blanket "something failed."
        pytest_match = re.search(r"^FAILED\s+(\S+)", log, re.MULTILINE)
        jest_match = re.search(r"^FAIL\s+(\S+)", log, re.MULTILINE)
        assertion_match = re.search(
            r"^.*AssertionError.*$", log, re.MULTILINE
        )
        count_match = re.search(r"^(\d+)\s+failed", log, re.MULTILINE)
        generic_match = re.search(r"^Test Failed\b", log, re.MULTILINE)

        matched = bool(
            pytest_match
            or jest_match
            or assertion_match
            or count_match
            or generic_match
        )

        if not matched:
            return RuleResult(matched=False)

        test_id = None

        if pytest_match:
            test_id = pytest_match.group(1)
        elif jest_match:
            test_id = jest_match.group(1)

        assertion_detail = (
            assertion_match.group(0).strip()
            if assertion_match
            else None
        )

        if test_id and assertion_detail:
            root_cause = f"Test '{test_id}' failed: {assertion_detail}"
        elif test_id:
            root_cause = f"Test '{test_id}' failed."
        elif assertion_detail:
            root_cause = f"A test assertion failed: {assertion_detail}"
        elif count_match:
            count = count_match.group(1)
            plural = "s" if count != "1" else ""
            root_cause = f"{count} automated test{plural} failed."
        else:
            root_cause = "One or more automated tests failed."

        return RuleResult(
            matched=True,
            error_type="Test Failure",
            root_cause=root_cause,
            explanation=(
                "The project built successfully, but one or more "
                "test cases did not pass."
            ),
            fix_suggestion=(
                "Review the failing test case above and update "
                "either the implementation or the test expectations "
                "to match the intended behavior."
            ),
            fix_command=None,
        )