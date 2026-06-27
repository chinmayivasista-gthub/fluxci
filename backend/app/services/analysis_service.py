import uuid

from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.models.processing_job import ProcessingJob

from app.repositories.analysis_repository import AnalysisRepository
from app.repositories.processing_job_repository import (
    ProcessingJobRepository,
)

from app.services.log_processing_pipeline import (
    LogProcessingPipeline,
)
from app.services.deterministic_engine import (
    DeterministicEngine,
)
from app.services.decision_engine import (
    DecisionEngine,
)
from app.services.gemini_service import (
    GeminiService,
)


class AnalysisService:

    @staticmethod
    def create_job(
        db: Session,
    ) -> ProcessingJob:
        """
        Creates a ProcessingJob before analysis begins.
        """

        job = ProcessingJob(
            job_id=str(uuid.uuid4()),
            status="processing",
        )

        return ProcessingJobRepository.create(
            db,
            job,
        )

    @staticmethod
    def process_job(
        db: Session,
        job_id: str,
        log: str,
    ) -> None:
        """
        Executes the complete analysis pipeline and
        stores the final analysis in the database.
        """

        try:

            processed = LogProcessingPipeline().process(
                log
            )

            rule_result = DeterministicEngine.analyze(
                processed.cleaned_log
            )

            if rule_result.matched:

                analysis_source = "deterministic"

                error_type = rule_result.error_type
                root_cause = rule_result.root_cause
                explanation = rule_result.explanation
                fix_suggestion = rule_result.fix_suggestion
                fix_command = rule_result.fix_command

            else:

                analysis_source = "gemini"

                gemini_result = GeminiService().analyze(
                    processed.cleaned_log
                )

                error_type = gemini_result.error_type
                root_cause = gemini_result.root_cause
                explanation = gemini_result.explanation
                fix_suggestion = gemini_result.fix_suggestion
                fix_command = gemini_result.fix_command

            analysis = Analysis(
                job_id=job_id,
                original_log=log,
                cleaned_log=processed.cleaned_log,
                error_type=error_type,
                root_cause=root_cause,
                explanation=explanation,
                analysis_source=analysis_source,
                fix_suggestion=fix_suggestion,
                fix_command=fix_command,
            )

            AnalysisRepository.create(
                db,
                analysis,
            )

            job = ProcessingJobRepository.get_by_job_id(
                db,
                job_id,
            )

            ProcessingJobRepository.update_status(
                db,
                job,
                "completed",
            )

        except Exception:

            job = ProcessingJobRepository.get_by_job_id(
                db,
                job_id,
            )

            if job:

                ProcessingJobRepository.update_status(
                    db,
                    job,
                    "failed",
                )

            raise