from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from .config import settings
from .database import connect_db, close_db, get_db
from .cloudinary_config import init_cloudinary
from .routers import auth, products, brands, categories

_start_time = datetime.now(timezone.utc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    init_cloudinary()
    yield
    await close_db()


app = FastAPI(
    title="Bansal Fireworks API",
    description=(
        "REST API for the Bansal Fireworks e-commerce platform.\n\n"
        "## Authentication\n"
        "Protected endpoints require a **Bearer JWT token**.\n"
        "1. Call `POST /api/admin/login` with your email and password.\n"
        "2. Copy the `token` from the response.\n"
        "3. Click **Authorize** (top right), enter `Bearer <token>`, and click **Authorize**.\n\n"
        "All write operations (create / update / delete) require a valid token."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(brands.router)
app.include_router(categories.router)


# ── Health ────────────────────────────────────────────────────────────────────
@app.get(
    "/api/health",
    tags=["health"],
    summary="Health check",
    description="Returns service status, MongoDB connectivity, uptime, and version.",
)
async def health():
    uptime_seconds = (datetime.now(timezone.utc) - _start_time).total_seconds()

    # Ping MongoDB
    db_status = "ok"
    try:
        db = get_db()
        await db.client.admin.command("ping")
    except Exception:
        db_status = "unreachable"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "service": "bansal-fireworks-api",
        "version": "1.0.0",
        "database": db_status,
        "uptime_seconds": round(uptime_seconds, 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ── Custom OpenAPI schema (adds Bearer security scheme) ───────────────────────
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Add Bearer JWT security scheme so the Authorize button appears in Swagger
    schema.setdefault("components", {})
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Paste your JWT token (without the 'Bearer' prefix).",
        }
    }

    # Apply security globally to all operations that aren't public
    for path, methods in schema.get("paths", {}).items():
        for method, operation in methods.items():
            tags = operation.get("tags", [])
            # Auth and health endpoints are public — skip them
            if "auth" in tags or "health" in tags:
                continue
            # Only apply to write methods
            if method.lower() in ("post", "put", "delete", "patch"):
                operation.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = schema
    return app.openapi_schema


app.openapi = custom_openapi
