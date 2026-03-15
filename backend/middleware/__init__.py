from typing import Optional
from fastapi import Header, HTTPException, status
import jwt
from bson import ObjectId
from config import settings
from database import get_db


async def get_current_user(authorization: str = Header(...)) -> dict:
    """
    FastAPI dependency. Extracts and validates Bearer JWT.
    Returns the decoded payload dict on success.
    Raises HTTP 401 on any failure.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"message": "Invalid or expired token"},
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not authorization.startswith("Bearer "):
        raise credentials_exception

    token = authorization.removeprefix("Bearer ").strip()

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Token has expired"},
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise credentials_exception

    user_id: Optional[str] = payload.get("sub")
    if not user_id:
        raise credentials_exception

    db = get_db()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id), "is_active": True})
    except Exception:
        raise credentials_exception

    if user is None:
        raise credentials_exception

    return {"user_id": user_id, "email": payload.get("email")}
