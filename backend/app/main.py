from fastapi import FastAPI

app = FastAPI(
    title="FluxCI API",
    version="1.0.0"
)

@app.get("/")
def health_check():
    return {
        "status": "running",
        "project": "FluxCI"
    }