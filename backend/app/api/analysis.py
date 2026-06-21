from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.analysis import Analysis
from app.repositories.analysis_repository import AnalysisRepository
from app.schemas.analysis import AnalysisCreate

router = APIRouter()


@router.post("/analyze")
def analyze_log(
    payload: AnalysisCreate,
    db: Session = Depends(get_db)
):
    analysis = Analysis(
        original_log=payload.log
    )

    saved_analysis = AnalysisRepository.create(
        db,
        analysis
    )

    return {
        "message": "Analysis saved successfully",
        "id": saved_analysis.id
    }