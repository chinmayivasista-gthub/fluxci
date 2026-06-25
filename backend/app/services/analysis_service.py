from app.services.log_processing_pipeline import (
    LogProcessingPipeline,
)

from app.services.deterministic_engine import (
    DeterministicEngine,
)

from app.services.decision_engine import (
    DecisionEngine,
)


class AnalysisService:

    @staticmethod
    def analyze(log: str):

        processed = (
            LogProcessingPipeline().process(log)
        )

        rule_result = (
            DeterministicEngine.analyze(
                processed.cleaned_log
            )
        )

        decision = (
            DecisionEngine.analyze(
                rule_result
            )
        )

        return {
            "processed": processed,
            "rule_result": rule_result,
            "decision": decision,
        }