import re

from app.schemas.rule_result import RuleResult


class DockerRules:

    @staticmethod
    def docker_build_failure(log: str) -> RuleResult:

        patterns = [
            r"failed to solve",
            r"pull access denied",
            r"manifest for (.+?) not found",
            r"no such image",
        ]

        for pattern in patterns:

            match = re.search(pattern, log, re.IGNORECASE)

            if match:

                image = (
                    match.group(1)
                    if match.lastindex
                    else None
                )

                return RuleResult(
                    matched=True,
                    error_type="Docker Failure",
                    root_cause=(
                        f"Docker image '{image}' could not be found."
                        if image
                        else "Docker build failed."
                    ),
                    explanation=(
                        "Docker could not build or retrieve the required image."
                    ),
                    fix_suggestion=(
                        "Verify the Docker image name, tag, and registry configuration."
                    ),
                    fix_command=None,
                )

        return RuleResult(matched=False)