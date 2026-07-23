import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import HTTPException, Request


class RateLimiter:

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)
        self._lock = Lock()

    def check(self, key: str) -> bool:
        now = time.time()

        with self._lock:
            hits = self._hits[key]

            while hits and now - hits[0] > self.window_seconds:
                hits.popleft()

            if len(hits) >= self.max_requests:
                return False

            hits.append(now)
            return True


analyze_rate_limiter = RateLimiter(
    max_requests=5,
    window_seconds=60,
)


def enforce_rate_limit(request: Request):
    client_key = (
        request.client.host if request.client else "unknown"
    )

    if not analyze_rate_limiter.check(client_key):
        raise HTTPException(
            status_code=429,
            detail=(
                "Too many requests. Please wait a moment before "
                "submitting another log."
            ),
        )