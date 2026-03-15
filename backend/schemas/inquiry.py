from pydantic import BaseModel
from typing import Optional


class InquiryCreate(BaseModel):
    name: str
    phone: str
    requirement: str = "Wholesale Order"
    message: str


class InquiryResponse(BaseModel):
    id: str
    name: str
    phone: str
    requirement: str
    message: str
    is_read: bool
    created_at: Optional[str] = None
