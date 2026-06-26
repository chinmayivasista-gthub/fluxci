from sqlalchemy.orm import Session

from app.models.processing_job import ProcessingJob


class ProcessingJobRepository:

    @staticmethod
    def create(
        db: Session,
        job: ProcessingJob,
    ) -> ProcessingJob:

        db.add(job)
        db.commit()
        db.refresh(job)

        return job

    @staticmethod
    def get_by_job_id(
        db: Session,
        job_id: str,
    ) -> ProcessingJob | None:

        return (
            db.query(ProcessingJob)
            .filter(
                ProcessingJob.job_id == job_id
            )
            .first()
        )

    @staticmethod
    def update_status(
        db: Session,
        job: ProcessingJob,
        status: str,
    ) -> ProcessingJob:

        job.status = status

        db.commit()
        db.refresh(job)

        return job