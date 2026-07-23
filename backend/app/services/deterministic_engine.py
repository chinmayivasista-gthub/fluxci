from app.rules.python_rules import PythonRules
from app.rules.node_rules import NodeRules
from app.rules.docker_rules import DockerRules
from app.rules.compiler_rules import CompilerRules
from app.rules.github_actions_rules import GithubActionsRules

from app.schemas.rule_result import RuleResult
from app.rules.test_rules import TestRules
from app.rules.lint_rules import LintRules


class DeterministicEngine:

    RULES = [
        PythonRules.module_not_found,
        PythonRules.import_error,
        PythonRules.pip_dependency_failure,

        NodeRules.npm_dependency_failure,

        GithubActionsRules.token_permission_error,

        TestRules.test_failure,

        LintRules.lint_failure,

        CompilerRules.compilation_failure,

        DockerRules.docker_build_failure,
    ]

    @classmethod
    def analyze(cls, log: str) -> RuleResult:

        matches = []

        for rule in cls.RULES:

            result = rule(log)

            # Defensive: a rule function that falls through without an
            # explicit return implicitly returns None in Python. Treat
            # that the same as "did not match" instead of crashing, so
            # one broken rule can't take down the whole pipeline.
            if result is None:
                continue

            if result.matched:
                matches.append(result)

        # Exactly one distinct rule fired: safe to trust it.
        if len(matches) == 1:
            return matches[0]

        # Zero rules fired, OR two-or-more DIFFERENT failure
        # signatures fired at once. In the second case, the log
        # genuinely contains multiple distinct problems — no single
        # rule's canned answer can honestly represent that, so this
        # falls through to Gemini for real synthesis instead of
        # silently reporting only whichever rule happened to be
        # checked first.
        return RuleResult(
            matched=False
        )