"""
FastAPI application entry point for Casper Shorts backend.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings

logger = logging.getLogger(__name__)


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown logic."""
    logger.info("Starting Casper Shorts API (env: %s)", settings.app_env)
    yield
    logger.info("Shutting down Casper Shorts API")


# ── App Init ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Casper Shorts API",
    description="AI-powered Video-to-Shorts SaaS platform",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static Files ──────────────────────────────────────────────────────────────
import os
os.makedirs(settings.local_storage_path, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.local_storage_path), name="static")


# ── Exception Handlers ────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health_check():
    """Service health check — no auth required."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "env": settings.app_env,
        "version": "1.0.0",
    }


# ── API Routers ───────────────────────────────────────────────────────────────
from app.routers import auth, projects, videos, processing, clips, subscriptions, admin

API_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_PREFIX, tags=["auth"])
app.include_router(projects.router, prefix=API_PREFIX, tags=["projects"])
app.include_router(videos.router, prefix=API_PREFIX, tags=["videos"])
app.include_router(processing.router, prefix=API_PREFIX, tags=["processing"])
app.include_router(clips.router, prefix=API_PREFIX, tags=["clips"])
app.include_router(subscriptions.router, prefix=API_PREFIX, tags=["subscriptions"])
app.include_router(admin.router, prefix=API_PREFIX, tags=["admin"])
