import re

from app.schemas.rule_result import RuleResult


class LintRules:

    @staticmethod
    def lint_failure(log: str) -> RuleResult:

        tool_patterns = {
            "eslint": r"eslint",
            "flake8": r"flake8",
            "pylint": r"pylint",
        }

        generic_patterns = [
            r"style violations?",
            r"lint failed",
        ]

        matched_tool = None

        for tool, pattern in tool_patterns.items():
            if re.search(pattern, log, re.IGNORECASE):
                matched_tool = tool
                break

        if not matched_tool:
            for pattern in generic_patterns:
                if re.search(pattern, log, re.IGNORECASE):
                    matched_tool = "generic"
                    break

        if not matched_tool:
            return RuleResult(matched=False)

        # Only eslint has a built-in, generally-safe autofix flag.
        # flake8/pylint have no universal safe autofixer, so we
        # don't invent one rather than risk a wrong/destructive
        # suggestion.
        fix_command = (
            "npx eslint . --fix" if matched_tool == "eslint" else None
        )

        tool_label = {
            "eslint": "ESLint",
            "flake8": "flake8",
            "pylint": "Pylint",
            "generic": "The project's linter",
        }[matched_tool]

        return RuleResult(
            matched=True,
            error_type="Lint Failure",
            root_cause=f"{tool_label} reported code style violations.",
            explanation=(
                "The source code violates one or more linting or "
                "formatting rules enforced by the project's "
                "linter."
            ),
            fix_suggestion=(
                "Run the project's formatter or lint fixer and "
                "correct any remaining reported issues manually."
                if fix_command is None
                else (
                    "Run ESLint's autofix, then re-check anything "
                    "it can't fix automatically."
                )
            ),
            fix_command=fix_command,
        )