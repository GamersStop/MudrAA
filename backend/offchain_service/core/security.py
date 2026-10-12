"""
MudrAA Security Middleware & Guardrails
Adheres to institutional security standards:
- Defense-in-depth CSRF verification
- Rate-limiting with sliding window
- Hardened HTTP security headers
"""

import time
import os
from typing import Dict, List, Tuple
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

# Sliding Window Rate Limiter
class RateLimiter:
    def __init__(self, max_requests: int = 120, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = {}
        self.last_cleanup = time.time()

    def is_allowed(self, client_ip: str) -> Tuple[bool, int, int]:
        now = time.time()
        # Periodic cleanup of expired records every 5 minutes
        if now - self.last_cleanup > 300:
            self._cleanup(now)
            self.last_cleanup = now

        user_reqs = self.requests.get(client_ip, [])
        cutoff = now - self.window_seconds
        user_reqs = [t for t in user_reqs if t > cutoff]

        remaining = max(0, self.max_requests - len(user_reqs))

        if len(user_reqs) >= self.max_requests:
            self.requests[client_ip] = user_reqs
            return False, 0, int(user_reqs[0] + self.window_seconds - now)

        user_reqs.append(now)
        self.requests[client_ip] = user_reqs
        return True, remaining, 0

    def _cleanup(self, now: float):
        cutoff = now - self.window_seconds
        stale_keys = [k for k, v in self.requests.items() if not v or v[-1] < cutoff]
        for k in stale_keys:
            del self.requests[k]


global_rate_limiter = RateLimiter(max_requests=120, window_seconds=60)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects high-security compliance headers across all HTTP responses."""
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
        return response


class RateLimitAndCSRFMiddleware(BaseHTTPMiddleware):
    """
    Enforces per-IP request throttling and validates Origins on mutating HTTP actions
    to prevent Cross-Site Request Forgery (CSRF).
    """
    def __init__(self, app, allowed_origins: List[str]):
        super().__init__(app)
        self.allowed_origins = set(allowed_origins)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"

        # Rate Limiting
        allowed, remaining, retry_after = global_rate_limiter.is_allowed(client_ip)
        if not allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "detail": "Too many requests. Please wait before submitting more sovereign verification payloads.",
                    "retry_after_seconds": retry_after,
                },
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(global_rate_limiter.max_requests),
                    "X-RateLimit-Remaining": "0",
                },
            )

        # CSRF Origin validation for mutating requests (POST, PUT, DELETE, PATCH)
        if request.method in ("POST", "PUT", "DELETE", "PATCH"):
            origin = request.headers.get("origin")
            if origin:
                # Normalize origin
                normalized = origin.rstrip("/")
                allowed_normalized = {o.rstrip("/") for o in self.allowed_origins}
                if normalized not in allowed_normalized and not normalized.startswith("http://localhost:") and not normalized.startswith("http://127.0.0.1:"):
                    return JSONResponse(
                        status_code=403,
                        content={
                            "error": "CSRF Forbidden",
                            "detail": f"Origin '{origin}' is not authorized to execute state alterations.",
                        },
                    )

        response: Response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(global_rate_limiter.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response
