import re

from app.schemas.rule_result import RuleResult


class NodeRules:

    @staticmethod
    def npm_dependency_failure(log: str) -> RuleResult:

        patterns = [
            r"npm ERR! 404 Not Found",
            r"npm ERR! code E404",
            r"Cannot find module ['\"](.+?)['\"]",
        ]

        for pattern in patterns:

            match = re.search(pattern, log)

            if match:

                package = (
                    match.group(1)
                    if match.lastindex
                    else None
                )

                return RuleResult(
                    matched=True,
                    error_type="Dependency Error",
                    root_cause=(
                        f"Missing Node.js package '{package}'."
                        if package
                        else "npm dependency installation failed."
                    ),
                    explanation=(
                        "The required Node.js dependency "
                        "could not be located or installed."
                    ),
                    fix_suggestion=(
                        "Verify the package name, package.json, "
                        "and npm registry configuration."
                    ),
                    fix_command=(
                        f"npm install {package}"
                        if package
                        else "npm install"
                    ),
                )

        return RuleResult(matched=False)