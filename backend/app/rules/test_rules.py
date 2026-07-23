import re

from app.schemas.rule_result import RuleResult


class TestRules:

    @staticmethod
    def test_failure(log: str) -> RuleResult:

        # Look for the specific failing test first (pytest / Jest
        # formats) — naming the actual test is far more useful to
        # someone debugging than a blanket "something failed."
        pytest_match = re.search(r"^\s*FAILED\s+(\S+)", log, re.MULTILINE)
        jest_match = re.search(r"^\s*FAIL\s+(\S+)", log, re.MULTILINE)
        count_match = re.search(r"^\s*(\d+)\s+failed", log, re.MULTILINE)
        generic_match = re.search(
            r"^\s*Test Failed\b", log, re.MULTILINE
        )

        # AssertionError alone is specific and safe enough to trigger
        # this rule even without an explicit FAIL/FAILED marker line.
        assertion_trigger = re.search(
            r"^.*AssertionError.*$", log, re.MULTILINE
        )

        matched = bool(
            pytest_match
            or jest_match
            or count_match
            or generic_match
            or assertion_trigger
        )

        if not matched:
            return RuleResult(matched=False)

        test_id = None

        if pytest_match:
            test_id = pytest_match.group(1)
        elif jest_match:
            test_id = jest_match.group(1)

        # Broader detail extraction — used only to ENRICH the root
        # cause once we already know (via a test-runner marker above)
        # that this is a genuine test failure. Deliberately NOT a
        # bare "Error:" pattern and NOT used as a standalone trigger,
        # since exception class names can appear in logs that have
        # nothing to do with a failing test — only test-runner
        # markers are trusted to decide "this is a test failure" on
        # their own.
        error_detail_match = re.search(
            r"^\s*(?:AssertionError|TypeError|ReferenceError|"
            r"SyntaxError|RangeError):\s.*$",
            log,
            re.MULTILINE,
        )
        error_detail = (
            error_detail_match.group(0).strip()
            if error_detail_match
            else None
        )

        if test_id and error_detail:
            root_cause = f"Test '{test_id}' failed: {error_detail}"
        elif test_id:
            root_cause = f"Test '{test_id}' failed."
        elif error_detail:
            root_cause = f"A test failed: {error_detail}"
        elif count_match:
            count = count_match.group(1)
            plural = "s" if count != "1" else ""
            root_cause = f"{count} automated test{plural} failed."
        else:
            root_cause = "One or more automated tests failed."

        # --- Dynamic, detailed explanation -------------------------------
        # Builds a real diagnosis instead of a fixed template: names the
        # error class, what it means in practice, and where it happened,
        # so the reader understands *why* this failed, not just *that*
        # it failed.
        error_class = None
        error_message = None

        if error_detail:
            error_class_match = re.match(
                r"(AssertionError|TypeError|ReferenceError|"
                r"SyntaxError|RangeError):\s*(.*)",
                error_detail,
            )
            if error_class_match:
                error_class = error_class_match.group(1)
                error_message = error_class_match.group(2).strip()

        error_class_meaning = {
            "AssertionError": (
                "the code ran without crashing, but produced a "
                "different result than the test expected"
            ),
            "TypeError": (
                "the code tried to use a value in a way its actual "
                "type doesn't support — commonly calling a method on "
                "undefined/null, or passing the wrong data shape into "
                "a function"
            ),
            "ReferenceError": (
                "the code referenced a variable or function that "
                "doesn't exist in that scope, usually from a typo, a "
                "missing import, or something not yet defined at "
                "that point in execution"
            ),
            "SyntaxError": (
                "the file itself couldn't be parsed — there's likely "
                "a typo or malformed statement introduced very "
                "recently"
            ),
            "RangeError": (
                "a value fell outside what the code can handle, such "
                "as an invalid array length, a number out of bounds, "
                "or runaway recursion"
            ),
        }

        if test_id and error_class and error_message:
            meaning = error_class_meaning.get(
                error_class,
                "the code hit an unexpected runtime error",
            )
            explanation = (
                f"The build itself succeeded — this isn't a "
                f"compilation or dependency problem. The test suite "
                f"caught a real issue inside '{test_id}': a "
                f"{error_class} was thrown — {error_message}. In "
                f"practice, this means {meaning}. Because this "
                f"surfaced during automated testing rather than the "
                f"build step, treat it as an actual regression in "
                f"application logic, not flakiness or an environment "
                f"issue."
            )
        elif test_id and error_class:
            meaning = error_class_meaning.get(
                error_class,
                "the code hit an unexpected runtime error",
            )
            explanation = (
                f"The build itself succeeded, but '{test_id}' threw "
                f"a {error_class} during test execution. In "
                f"practice, this means {meaning}. This points to a "
                f"genuine bug in the code path this test exercises, "
                f"not a flaky test."
            )
        elif test_id:
            explanation = (
                f"The build itself succeeded, but the test suite "
                f"caught a real failure in '{test_id}'. This is a "
                f"logic mismatch between what the code currently "
                f"does and what the test expects — worth treating as "
                f"a genuine regression rather than assuming it's "
                f"flaky, especially since it reproduced clearly in "
                f"this run."
            )
        elif count_match:
            count = count_match.group(1)
            plural = "s" if count != "1" else ""
            explanation = (
                f"The build itself succeeded, but {count} test"
                f"{plural} failed during the automated test stage. "
                f"The log doesn't name the specific test file here, "
                f"so check your test runner's full output above this "
                f"summary line to see exactly which assertions "
                f"failed and why."
            )
        else:
            explanation = (
                "The build itself succeeded, but the test stage "
                "reported a failure without naming a specific test "
                "or file. This usually still means a real assertion "
                "failed somewhere in the suite — scroll up in the "
                "raw log for the first FAIL/AssertionError line, "
                "since that's normally the actual failure and "
                "everything after it is just the test runner's "
                "summary."
            )

        # --- Concrete, runnable fix command -------------------------------
        # Prefer re-running just the failing test in isolation — much
        #