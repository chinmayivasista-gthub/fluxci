from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.database.database import (
    SessionLocal,
    get_db,
)

from app.repositories.analysis_repository import (
    AnalysisRepository,
)
from app.repositories.processing_job_repository import (
    ProcessingJobRepository,
)

from app.schemas.analysis_response import (
    AnalysisResponse,
)
from app.schemas.job_response import (
    JobResponse,
)

from app.services.analysis_service import (
    AnalysisService,
)

router = APIRouter()


def process_analysis(
    job_id: str,
    log: str,
):
    """
    Background worker responsible for executing
    the complete analysis pipeline.
    """

    db = SessionLocal()

    try:
        AnalysisService.process_job(
            db,
            job_id,
            log,
        )

    finally:
        db.close()


@router.post("/analyze")
def analyze_log(
    log: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    job = AnalysisService.create_job(db)

    background_tasks.add_task(
        process_analysis,
        job.job_id,
        log,
    )

    return {
        "job_id": job.job_id,
        "status": job.status,
    }


@router.get(
    "/jobs/{job_id}",
    response_model=JobResponse,
)
def get_job_status(
    job_id: str,
    db: Session = Depends(get_db),
):
    job = ProcessingJobRepository.get_by_job_id(
        db,
        job_id,
    )

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found.",
        )

    analysis = AnalysisRepository.get_by_job_id(
        db,
        job_id,
    )

    analysis_response = None

    if analysis:
        analysis_response = AnalysisResponse(
            error_type=analysis.error_type,
            root_cause=analysis.root_cause,
            explanation=analysis.explanation,
            fix_suggestion=analysis.fix_suggestion,
            fix_command=analysis.fix_command,
            analysis_source=analysis.analysis_source,
        )

    return JobResponse(
        job_id=job.job_id,
        status=job.status,
        analysis=analysis_response,
    )