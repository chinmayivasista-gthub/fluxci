import re

from app.schemas.rule_result import RuleResult


class DockerRules:

    @staticmethod
    def docker_build_failure(log: str) -> RuleResult:

        patterns = [
            r"pull access denied",
            r"manifest for (.+?) not found",
            r"no such image",
            r"invalid reference format",
            r"cannot connect to the docker daemon",
            r"no space left on device",
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
                        else "Docker could not build or retrieve "
                        "the required image."
                    ),
                    explanation=(
                        "This is an infrastructure-level Docker "
                        "failure (image, registry, daemon, or disk "
                        "space) rather than a failure in the "
                        "application code itself."
                    ),
                    fix_suggestion=(
                        "Verify the Docker image name, tag, and "
                        "registry configuration, and confirm the "
                        "Docker daemon has network access and "
                        "sufficient disk space."
                    ),
                    fix_command=None,
                )

        return RuleResult(matched=False)