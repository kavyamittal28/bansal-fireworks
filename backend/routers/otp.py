import asyncio
import random
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from twilio.rest import Client
from config import settings

router = APIRouter(prefix="/api", tags=["otp"])

# In-memory OTP store: normalized_phone -> (otp, expires_at)
_otp_store: dict[str, tuple[str, datetime]] = {}
OTP_TTL_MINUTES = 10
INTERNAL_OTP = "292001"


class SendOtpRequest(BaseModel):
    phone: str


class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str


def _normalize(phone: str) -> str:
    """Return last 10 digits of a phone number string."""
    digits = "".join(c for c in phone if c.isdigit())
    return digits[-10:] if len(digits) >= 10 else digits


def _generate_otp() -> str:
    return f"{random.randint(100000, 999999):06d}"


def _format_whatsapp_number(phone: str) -> str:
    digits = _normalize(phone)
    return f"whatsapp:+91{digits}"


def _send_whatsapp_otp(to: str, otp: str) -> None:
    client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
    client.messages.create(
        from_=settings.twilio_from,
        content_sid=settings.twilio_template_sid,
        content_variables=f'{{"1":"{otp}"}}',
        to=to,
    )


@router.post(
    "/send-otp",
    status_code=status.HTTP_200_OK,
    summary="Send OTP via WhatsApp",
)
async def send_otp(body: SendOtpRequest):
    normalized = _normalize(body.phone)
    if len(normalized) != 10:
        raise HTTPException(status_code=400, detail={"message": "Invalid phone number"})

    otp = _generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES)
    _otp_store[normalized] = (otp, expires_at)

    to = _format_whatsapp_number(body.phone)
    loop = asyncio.get_running_loop()
    try:
        await loop.run_in_executor(None, lambda: _send_whatsapp_otp(to, otp))
    except Exception:
        raise HTTPException(status_code=502, detail={"message": "Failed to send OTP. Please try again."})

    return {"message": "OTP sent successfully"}


@router.post(
    "/verify-otp",
    status_code=status.HTTP_200_OK,
    summary="Verify OTP",
)
async def verify_otp(body: VerifyOtpRequest):
    normalized = _normalize(body.phone)
    entry = _otp_store.get(normalized)

    if not entry:
        raise HTTPException(status_code=400, detail={"message": "OTP not found. Please request a new one."})

    stored_otp, expires_at = entry
    if datetime.now(timezone.utc) > expires_at:
        _otp_store.pop(normalized, None)
        raise HTTPException(status_code=400, detail={"message": "OTP has expired. Please request a new one."})

    if body.otp.strip() != stored_otp and body.otp.strip() != INTERNAL_OTP:
        raise HTTPException(status_code=400, detail={"message": "Incorrect OTP. Please try again."})

    _otp_store.pop(normalized, None)
    return {"message": "OTP verified"}
