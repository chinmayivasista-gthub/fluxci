from app.rules.python_rules import PythonRules
from app.rules.node_rules import NodeRules
from app.rules.docker_rules import DockerRules
from app.rules.compiler_rules import CompilerRules

from app.schemas.rule_result import RuleResult
from app.rules.test_rules import TestRules
from app.rules.lint_rules import LintRules


class DeterministicEngine:

    RULES = [
        PythonRules.module_not_found,
        PythonRules.import_error,
        PythonRules.pip_dependency_failure,

        NodeRules.npm_dependency_failure,

        DockerRules.docker_build_failure,

        CompilerRules.compilation_failure,
    ]

    @classmethod
    def analyze(cls, log: str) -> RuleResult:

        for rule in cls.RULES:

            result = rule(log)

            if result.matched:
                return result

        return RuleResult(
            matched=False
        )