from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from bson import ObjectId
from datetime import datetime, timezone
from middleware.auth import get_current_user
from database import get_db
from schemas.order import OrderCreate
from utils import upload_file

router = APIRouter(prefix="/api", tags=["orders"])
CurrentUser = Annotated[dict, Depends(get_current_user)]


def _fmt(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    for field in ("created_at", "payment_uploaded_at"):
        if hasattr(doc.get(field), "isoformat"):
            doc[field] = doc[field].isoformat()
    return doc


@router.post(
    "/place-order",
    status_code=status.HTTP_201_CREATED,
    summary="Place an order",
    description="Public endpoint. Saves a customer order from the cart.",
)
async def place_order(body: OrderCreate):
    db = get_db()
    counter = await db.counters.find_one_and_update(
        {"_id": "order_number"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    order_number = counter["seq"]
    doc = {
        "order_number": order_number,
        "name": body.name,
        "phone": body.phone,
        "items": [item.model_dump() for item in body.items],
        "total_amount": body.total_amount,
        "total_pieces": body.total_pieces,
        "status": "pending",
        "is_read": False,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.orders.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _fmt(doc)


@router.get(
    "/order/{order_id}",
    summary="Get order by ID",
    description="Public endpoint. Fetch a single order for the payment page.",
)
async def get_order(order_id: str):
    db = get_db()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid order ID"})
    doc = await db.orders.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Order not found"})
    return _fmt(doc)


@router.post(
    "/order/{order_id}/payment-screenshot",
    summary="Upload payment screenshot",
    description="Public endpoint. Upload a UPI payment screenshot for an order.",
)
async def upload_payment_screenshot(
    order_id: str,
    screenshot: UploadFile = File(...),
):
    db = get_db()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid order ID"})
    doc = await db.orders.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Order not found"})

    asset = await upload_file(screenshot, folder="bansal-fireworks/payment-screenshots")
    if not asset:
        raise HTTPException(status_code=400, detail={"message": "Screenshot upload failed"})

    await db.orders.update_one(
        {"_id": oid},
        {"$set": {
            "payment_screenshot_url": asset.url,
            "payment_status": "pending_confirmation",
            "payment_uploaded_at": datetime.now(timezone.utc),
        }},
    )
    doc = await db.orders.find_one({"_id": oid})
    return _fmt(doc)


@router.patch(
    "/admin/confirm-payment/{order_id}",
    summary="Confirm payment",
    description="Admin approves the payment screenshot. **Requires Bearer token.**",
)
async def confirm_payment(order_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid order ID"})
    result = await db.orders.update_one(
        {"_id": oid},
        {"$set": {"payment_status": "confirmed", "status": "acknowledged"}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Order not found"})
    doc = await db.orders.find_one({"_id": oid})
    return _fmt(doc)


@router.patch(
    "/admin/reject-payment/{order_id}",
    summary="Reject payment",
    description="Admin rejects the payment screenshot. **Requires Bearer token.**",
)
async def reject_payment(order_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid order ID"})
    result = await db.orders.update_one(
        {"_id": oid},
        {"$set": {"payment_status": "rejected", "status": "pending"}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Order not found"})
    doc = await db.orders.find_one({"_id": oid})
    return _fmt(doc)


@router.get(
    "/admin/orders",
    summary="List all orders",
    description="Returns all customer orders, newest first. **Requires Bearer token.**",
)
async def list_orders(current_user: CurrentUser):
    db = get_db()
    docs = await db.orders.find().sort("created_at", -1).to_list(length=500)
    return [_fmt(d) for d in docs]


@router.patch(
    "/admin/toggle-order/{order_id}",
    summary="Toggle order read status",
    description="Toggle the read/acknowledged status of an order. **Requires Bearer token.**",
)
async def toggle_order(order_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid order ID"})
    doc = await db.orders.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Order not found"})
    new_status = not doc.get("is_read", False)
    await db.orders.update_one({"_id": oid}, {"$set": {"is_read": new_status}})
    doc = await db.orders.find_one({"_id": oid})
    return _fmt(doc)


@router.patch(
    "/admin/update-order-status/{order_id}",
    summary="Update order status",
    description="Update the fulfillment status of an order. **Requires Bearer token.**",
)
async def update_order_status(order_id: str, body: dict, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid order ID"})
    allowed = {"pending", "acknowledged", "completed"}
    new_status = body.get("status")
    if new_status not in allowed:
        raise HTTPException(status_code=400, detail={"message": "Invalid status"})
    updates = {"status": new_status}
    if body.get("fulfillment_type") in ("delivered", "picked_up"):
        updates["fulfillment_type"] = body["fulfillment_type"]
    result = await db.orders.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Order not found"})
    doc = await db.orders.find_one({"_id": oid})
    return _fmt(doc)


@router.delete(
    "/admin/delete-order/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an order",
    description="Permanently delete an order. **Requires Bearer token.**",
)
async def delete_order(order_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid order ID"})
    result = await db.orders.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Order not found"})
