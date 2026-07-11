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

    @staticmethod
    def update_current_step(
        db: Session,
        job: ProcessingJob,
        current_step: str,
    ) -> ProcessingJob:

        job.current_step = current_step

        db.commit()
        db.refresh(job)

        return job

    @staticmethod
    def update_progress(
        db: Session,
        job: ProcessingJob,
        *,
        status: str | None = None,
        current_step: str | None = None,
    ) -> ProcessingJob:

        if status is not None:
            job.status = status

        if current_step is not None:
            job.current_step = current_step

        db.commit()
        db.refresh(job)

        return job