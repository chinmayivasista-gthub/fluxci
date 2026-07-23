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

from app.schemas.analysis import (
    AnalysisCreate,
)
from app.schemas.analysis_response import (
    AnalysisResponse,
)
from app.services.auth import verify_api_key
from app.services.rate_limiter import enforce_rate_limit
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
    payload: AnalysisCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _auth: None = Depends(verify_api_key),
    _rate_limit: None = Depends(enforce_rate_limit),
):
    if not payload.log or not payload.log.strip():
        raise HTTPException(
            status_code=400,
            detail="Log content cannot be empty.",
        )

    job = AnalysisService.create_job(db)

    background_tasks.add_task(
        process_analysis,
        job.job_id,
        payload.log,
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
            id=analysis.id,
            job_id=analysis.job_id,
            error_type=analysis.error_type,
            root_cause=analysis.root_cause,
            explanation=analysis.explanation,
            fix_suggestion=analysis.fix_suggestion,
            fix_command=analysis.fix_command,
            exit_code=analysis.exit_code,
            analysis_source=analysis.analysis_source,
            created_at=analysis.created_at,
        )

    return JobResponse(
    job_id=job.job_id,
    status=job.status,
    current_step=job.current_step,
    analysis=analysis_response,
)



@router.get(
    "/history",
    response_model=list[AnalysisResponse],
)
def get_history(
    db: Session = Depends(get_db),
):
    return AnalysisRepository.get_all(db)


@router.get(
    "/history/search",
    response_model=list[AnalysisResponse],
)
def search_history(
    q: str,
    db: Session = Depends(get_db),
):
    return AnalysisRepository.search(
        db,
        q,
    )


@router.get(
    "/history/{analysis_id}",
    response_model=AnalysisResponse,
)
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
):
    analysis = AnalysisRepository.get_by_id(
        db,
        analysis_id,
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    return analysis


@router.delete("/history/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    _auth: None = Depends(verify_api_key),
):
    deleted = AnalysisRepository.delete_by_id(
        db,
        analysis_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    return {
        "message": "Analysis deleted successfully."
    }


@router.delete("/history")
def clear_history(
    db: Session = Depends(get_db),
    _auth: None = Depends(verify_api_key),
):
    AnalysisRepository.delete_all(db)

    return {
        "message": "History cleared successfully."
    }