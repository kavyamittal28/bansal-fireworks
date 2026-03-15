from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone
from middleware.auth import get_current_user
from database import get_db
from schemas.inquiry import InquiryCreate

router = APIRouter(prefix="/api", tags=["contact"])
CurrentUser = Annotated[dict, Depends(get_current_user)]


def _fmt(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    for field in ("created_at",):
        if hasattr(doc.get(field), "isoformat"):
            doc[field] = doc[field].isoformat()
    return doc


@router.post(
    "/contact",
    status_code=status.HTTP_201_CREATED,
    summary="Submit a contact inquiry",
    description="Public endpoint. Saves a customer inquiry from the contact form.",
)
async def create_inquiry(body: InquiryCreate):
    db = get_db()
    doc = {
        "name": body.name,
        "phone": body.phone,
        "requirement": body.requirement,
        "message": body.message,
        "is_read": False,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.inquiries.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _fmt(doc)


@router.get(
    "/inquiries",
    summary="List all inquiries",
    description="Returns all customer inquiries, newest first. **Requires Bearer token.**",
)
async def list_inquiries(current_user: CurrentUser):
    db = get_db()
    docs = await db.inquiries.find().sort("created_at", -1).to_list(length=500)
    return [_fmt(d) for d in docs]


@router.patch(
    "/inquiries/{inquiry_id}/read",
    summary="Mark inquiry as read",
    description="Toggle the read status of an inquiry. **Requires Bearer token.**",
)
async def mark_inquiry_read(inquiry_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(inquiry_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid inquiry ID"})
    doc = await db.inquiries.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Inquiry not found"})
    new_status = not doc.get("is_read", False)
    await db.inquiries.update_one({"_id": oid}, {"$set": {"is_read": new_status}})
    doc = await db.inquiries.find_one({"_id": oid})
    return _fmt(doc)


@router.delete(
    "/inquiries/{inquiry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an inquiry",
    description="Permanently delete an inquiry. **Requires Bearer token.**",
)
async def delete_inquiry(inquiry_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(inquiry_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid inquiry ID"})
    result = await db.inquiries.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Inquiry not found"})
