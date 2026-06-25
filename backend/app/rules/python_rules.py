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

    @staticmethod
    def import_error(log: str) -> RuleResult:

        pattern = r"ImportError: (.+)"

        match = re.search(pattern, log)

        if not match:
            return RuleResult(matched=False)

        error = match.group(1)

        return RuleResult(
            matched=True,
            error_type="Dependency Error",
            root_cause="Python import failed.",
            explanation=error,
            fix_suggestion=(
                "Verify the import statement, package installation, "
                "and package version compatibility."
            ),
            fix_command=None,
        )

    @staticmethod
    def pip_dependency_failure(log: str) -> RuleResult:

        patterns = [
            r"Could not find a version that satisfies the requirement (.+)",
            r"No matching distribution found for (.+)",
        ]

        for pattern in patterns:

            match = re.search(pattern, log)

            if match:

                package = match.group(1)

                return RuleResult(
                    matched=True,
                    error_type="Dependency Error",
                    root_cause=f"Unable to install '{package}'.",
                    explanation=(
                        "pip could not locate a compatible package "
                        "version for the requested dependency."
                    ),
                    fix_suggestion=(
                        "Verify the package name, Python version, "
                        "and package availability on PyPI."
                    ),
                    fix_command=f"pip install {package}",
                )

        return RuleResult(matched=False)