import os

from fastapi import Header, HTTPException


def verify_api_key(
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
):
    expected = os.getenv("FLUXCI_API_KEY")

    if not expected:
        raise HTTPException(
            status_code=500,
            detail=(
                "Server is not configured with FLUXCI_API_KEY. "
                "Set it in backend/.env."
            ),
        )

    if x_api_key != expected:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key.",
        )