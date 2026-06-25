import re

from app.schemas.rule_result import RuleResult


class PythonRules:

    @staticmethod
    def module_not_found(log: str) -> RuleResult:

        pattern = r"ModuleNotFoundError: No module named ['\"](.+?)['\"]"

        match = re.search(pattern, log)

        if not match:
            return RuleResult(matched=False)

        package = match.group(1)

        return RuleResult(
            matched=True,
            error_type="Dependency Error",
            root_cause=f"Missing Python package '{package}'",
            explanation=(
                f"The application attempted to import the "
                f"'{package}' package, but it is not installed "
                f"in the current environment."
            ),
            fix_suggestion=(
                f"Install the '{package}' package before running the application."
            ),
            fix_command=f"pip install {package}",
        )