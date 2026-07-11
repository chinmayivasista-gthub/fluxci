from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.database import engine
from dotenv import load_dotenv

load_dotenv()

# Import models so SQLAlchemy can discover them
from app.models.analysis import Analysis
from app.models.processing_job import ProcessingJob
from app.api.analysis_routes import router as analysis_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    
    title="FluxCI API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(analysis_router)

@app.get("/")
def health_check():
    return {
        "status": "running",
        "project": "FluxCI"
    }