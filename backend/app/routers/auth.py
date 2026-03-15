import asyncio
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, status
import jwt
import bcrypt
from ..config import settings
from ..database import get_db
from ..schemas.auth import LoginRequest, TokenResponse

router = APIRouter(tags=["auth"])


def _create_token(user_id: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


async def _login_handler(body: LoginRequest) -> TokenResponse:
    db = get_db()
    user = await db.users.find_one({"user_id": body.email})

    invalid_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"message": "Invalid email or password"},
    )

    if user is None:
        raise invalid_exc

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"message": "Account is disabled"},
        )

    # bcrypt.checkpw is CPU-intensive — run in thread pool to avoid blocking
    password_bytes = body.password.encode("utf-8")
    stored_hash = user["hashed_password"].encode("utf-8")
    loop = asyncio.get_running_loop()
    valid = await loop.run_in_executor(
        None,
        lambda: bcrypt.checkpw(password_bytes, stored_hash),
    )

    if not valid:
        raise invalid_exc

    token = _create_token(str(user["_id"]), user["user_id"])
    return TokenResponse(token=token)


@router.post(
    "/api/auth/login",
    response_model=TokenResponse,
    summary="Admin login",
    description="Authenticate with email and password. Returns a Bearer JWT token valid for 24 hours.",
)
async def login(body: LoginRequest):
    return await _login_handler(body)


@router.post(
    "/api/admin/login",
    response_model=TokenResponse,
    summary="Admin login (frontend alias)",
    description="Identical to `POST /api/auth/login`. Used by the React admin frontend.",
)
async def admin_login(body: LoginRequest):
    return await _login_handler(body)
