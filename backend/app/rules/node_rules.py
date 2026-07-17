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

                module_path = (
                    match.group(1)
                    if match.lastindex
                    else None
                )

                is_local_path = bool(
                    module_path
                    and re.match(r"^(\.{1,2}/|/)", module_path)
                )

                if is_local_path:

                    return RuleResult(
                        matched=True,
                        error_type="Dependency Error",
                        root_cause=(
                            f"Missing local file '{module_path}'."
                        ),
                        explanation=(
                            f"The application tried to import "
                            f"'{module_path}' as a local project "
                            f"file, but nothing exists at that path. "
                            f"This is a missing or misnamed file, "
                            f"not a missing npm package, so "
                            f"installing a package will not fix it."
                        ),
                        fix_suggestion=(
                            f"Check that '{module_path}' exists in "
                            f"the project and that the import path "
                            f"and filename are spelled correctly."
                        ),
                        fix_command=None,
                    )

                return RuleResult(
                    matched=True,
                    error_type="Dependency Error",
                    root_cause=(
                        f"Missing Node.js package '{module_path}'."
                        if module_path
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
                        f"npm install {module_path}"
                        if module_path
                        else "npm install"
                    ),
                )

        return RuleResult(matched=False)