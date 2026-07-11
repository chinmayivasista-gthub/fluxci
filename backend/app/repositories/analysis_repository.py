from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.analysis import Analysis


class AnalysisRepository:

    @staticmethod
    def create(db: Session, analysis: Analysis):
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis

    @staticmethod
    def get_by_id(
        db: Session,
        analysis_id: int,
    ):
        return (
            db.query(Analysis)
            .filter(Analysis.id == analysis_id)
            .first()
        )

    @staticmethod
    def get_by_job_id(
        db: Session,
        job_id: str,
    ):
        return (
            db.query(Analysis)
            .filter(Analysis.job_id == job_id)
            .first()
        )

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Analysis)
            .order_by(Analysis.created_at.desc())
            .all()
        )

    @staticmethod
    def search(
        db: Session,
        query: str,
    ):
        return (
            db.query(Analysis)
            .filter(
                or_(
                    Analysis.error_type.ilike(f"%{query}%"),
                    Analysis.root_cause.ilike(f"%{query}%"),
                    Analysis.explanation.ilike(f"%{query}%"),
                    Analysis.analysis_source.ilike(f"%{query}%"),
                )
            )
            .order_by(Analysis.created_at.desc())
            .all()
        )

    @staticmethod
    def delete_by_id(
        db: Session,
        analysis_id: int,
    ):
        analysis = (
            db.query(Analysis)
            .filter(Analysis.id == analysis_id)
            .first()
        )

        if analysis is None:
            return False

        db.delete(analysis)
        db.commit()

        return True

    @staticmethod
    def delete_all(
        db: Session,
    ):
        db.query(Analysis).delete()
        db.commit()