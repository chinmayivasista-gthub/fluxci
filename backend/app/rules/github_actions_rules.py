import re

from app.schemas.rule_result import RuleResult


class GithubActionsRules:

    @staticmethod
    def token_permission_error(log: str) -> RuleResult:

        match = re.search(
            r"does not have the required ['\"]?([\w:]+)['\"]? scope",
            log,
            re.IGNORECASE,
        )

        if not match:
            return RuleResult(matched=False)

        scope = match.group(1)
        resource, _, level = scope.partition(":")
        yaml_snippet = (
            f"permissions:\n  {resource}: {level}"
            if level
            else f"permissions:\n  {resource}: write"
        )

        return RuleResult(
            matched=True,
            error_type="GitHub Actions Permission Error",
            root_cause=(
                f"The workflow's GITHUB_TOKEN is missing the "
                f"required '{scope}' permission scope."
            ),
            explanation=(
                "GitHub Actions restricts the auto-generated "
                "GITHUB_TOKEN's permissions by default. This step "
                f"needs the '{scope}' scope, which hasn't been "
                "granted in the workflow file."
            ),
            fix_suggestion=(
                f"Add the '{scope}' permission to the 'permissions' "
                f"block of your workflow YAML file, for example:\n"
                f"{yaml_snippet}"
            ),
            fix_command=None,
        )