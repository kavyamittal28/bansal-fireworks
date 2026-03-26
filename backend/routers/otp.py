import asyncio
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from twilio.rest import Client
from config import settings

router = APIRouter(prefix="/api", tags=["otp"])


class SendOtpRequest(BaseModel):
    phone: str


def _format_whatsapp_number(phone: str) -> str:
    """Normalize to whatsapp:+91XXXXXXXXXX for 10-digit Indian numbers."""
    digits = phone.strip().lstrip("+")
    if len(digits) == 10:
        digits = "91" + digits
    return f"whatsapp:+{digits}"


def _send_whatsapp_otp(to: str) -> None:
    client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
    client.messages.create(
        from_=settings.twilio_from,
        content_sid=settings.twilio_template_sid,
        content_variables=f'{{"1":"{settings.twilio_otp}"}}',
        to=to,
    )


@router.post(
    "/send-otp",
    status_code=status.HTTP_200_OK,
    summary="Send OTP via WhatsApp",
    description="Sends a WhatsApp OTP to the customer's phone number before placing an order.",
)
async def send_otp(body: SendOtpRequest):
    if not body.phone.strip():
        raise HTTPException(status_code=400, detail={"message": "Phone number is required"})

    to = _format_whatsapp_number(body.phone)

    loop = asyncio.get_running_loop()
    try:
        await loop.run_in_executor(None, lambda: _send_whatsapp_otp(to))
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail={"message": "Failed to send OTP. Please try again."},
        )

    return {"message": "OTP sent successfully"}
