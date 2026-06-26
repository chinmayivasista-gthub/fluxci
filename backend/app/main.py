from fastapi import FastAPI

from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy can discover them
from app.models.analysis import Analysis
from app.models.processing_job import ProcessingJob
from app.api.analysis_routes import router as analysis_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FluxCI API",
    version="1.0.0"
)
app.include_router(analysis_router)

@app.get("/")
def health_check():
    return {
        "status": "running",
        "project": "FluxCI"
    }