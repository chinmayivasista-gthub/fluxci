from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

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

_origins_env = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
_allowed_origins = [
    origin.strip() for origin in _origins_env.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
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