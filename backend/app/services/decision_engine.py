from app.schemas.rule_result import RuleResult
from app.schemas.failure_classification import (
    FailureClassification,
)


class DecisionEngine:

    CATEGORY_CONFIG = {
        "Dependency Error": {
            "severity": "Medium",
            "confidence": 0.99,
            "recoverable": True,
            "requires_ai": False,
            "summary": (
                "A required dependency is missing or failed "
                "to install."
            ),
        },
        "Compilation Error": {
            "severity": "High",
            "confidence": 0.80,
            "recoverable": True,
            "requires_ai": True,
            "summary": (
                "Compilation failed because the source code "
                "contains one or more errors."
            ),
        },
        "GitHub Actions Permission Error": {
            "severity": "Medium",
            "confidence": 0.97,
            "recoverable": True,
            "requires_ai": False,
            "summary": (
                "The workflow's GITHUB_TOKEN lacks a required "
                "permission scope for this step."
            ),
        },
        "Docker Failure": {
            "severity": "High",
            "confidence": 0.70,
            "recoverable": True,
            "requires_ai": True,
            "summary": (
                "The Docker build or image retrieval process "
                "failed."
            ),
        },
        "Test Failure": {
           "severity": "High",
           "confidence": 0.95,
           "recoverable": True,
           "requires_ai": False,
           "summary": (
                 "One or more automated tests failed during execution."
            ),
        },

        "Lint Failure": {
           "severity": "Low",
           "confidence": 0.99,
           "recoverable": True,
           "requires_ai": False,
           "summary": (
                "Code style or linting violations were detected."
            ),
        },
    }

    @classmethod
    def analyze(
        cls,
        result: RuleResult,
    ) -> FailureClassification:

        if not result.matched:

            return FailureClassification(
                category="Unknown",
                severity="Low",
                confidence=0.0,
                recoverable=False,
                requires_ai=True,
                summary=(
                    "FluxCI could not determine the failure "
                    "using deterministic analysis."
                ),
            )

        config = cls.CATEGORY_CONFIG.get(
            result.error_type,
            {
                "severity": "Medium",
                "confidence": 0.50,
                "recoverable": False,
                "requires_ai": True,
                "summary": "Unknown failure detected.",
            },
        )

        return FailureClassification(
            category=result.error_type,
            severity=config["severity"],
            confidence=config["confidence"],
            recoverable=config["recoverable"],
            requires_ai=config["requires_ai"],
            summary=config["summary"],
        )