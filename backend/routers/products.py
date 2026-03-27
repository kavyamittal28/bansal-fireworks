import logging
from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from bson import ObjectId
from datetime import datetime, timezone
from middleware.auth import get_current_user
from database import get_db
from models.product import MediaAsset
from utils.media import upload_files, delete_assets

logger = logging.getLogger(__name__)

router = APIRouter(tags=["products"])
CurrentUser = Annotated[dict, Depends(get_current_user)]


def _fmt(doc: dict) -> dict:
    """Serialize a MongoDB product document for JSON response."""
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    doc["created_at"] = doc["created_at"].isoformat() if hasattr(doc.get("created_at"), "isoformat") else str(doc.get("created_at", ""))
    doc["updated_at"] = doc["updated_at"].isoformat() if hasattr(doc.get("updated_at"), "isoformat") else str(doc.get("updated_at", ""))
    return doc


def _parse_bool(value: Optional[str]) -> Optional[bool]:
    if value is None:
        return None
    return value.lower() in ("true", "1", "yes")


def _parse_optional_float(value: Optional[str]) -> Optional[float]:
    if value is None or value == "":
        return None
    return float(value)


def _parse_optional_int(value: Optional[str]) -> Optional[int]:
    if value is None or value == "":
        return None
    return int(value)


# ── Shared create handler ─────────────────────────────────────────────────────

async def _handle_create(
    current_user: dict,
    name: str,
    category: str,
    brand: str,
    price: float,
    market_price_str: Optional[str],
    stock_str: Optional[str],
    description: str,
    eco_friendly_str: str,
    bestseller_str: str,
    images: List[UploadFile],
    order_type_str: Optional[str] = "both",
    case_to_piece_qty_str: Optional[str] = None,
    wholesale_price_str: Optional[str] = None,
) -> dict:
    db = get_db()

    PLACEHOLDER_IMAGE = {
        "url": "https://www.bansalfireworks.com/placeholder.png",
        "public_id": "placeholder",
        "resource_type": "image",
    }

    media: List[MediaAsset] = []
    valid_images = [f for f in images if f.filename and f.size and f.size > 0]
    if valid_images:
        try:
            media = await upload_files(valid_images)
        except Exception as e:
            logger.error("[products] Image upload failed: %s", e)
            media = []

    media_list = [m.model_dump() for m in media] if media else [PLACEHOLDER_IMAGE]

    now = datetime.now(timezone.utc)
    doc = {
        "name": name,
        "category": category,
        "brand": brand,
        "price": price,
        "market_price": _parse_optional_float(market_price_str),
        "stock": _parse_optional_int(stock_str),
        "description": description,
        "eco_friendly": _parse_bool(eco_friendly_str) or False,
        "bestseller": _parse_bool(bestseller_str) or False,
        "order_type": order_type_str or "both",
        "case_to_piece_qty": _parse_optional_int(case_to_piece_qty_str),
        "wholesale_price": _parse_optional_float(wholesale_price_str),
        "media": media_list,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.products.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _fmt(doc)


@router.get(
    "/api/admin/get-products",
    summary="List all products (admin)",
    description="Returns all products including inactive ones. **Requires Bearer token.**",
)
async def admin_list_products(current_user: CurrentUser, skip: int = 0, limit: int = 100):
    db = get_db()
    cursor = db.products.find({}).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_fmt(d) for d in docs]


@router.patch(
    "/api/admin/toggle-product/{product_id}",
    summary="Toggle product active status",
    description="Flips `is_active` on a product. **Requires Bearer token.**",
)
async def toggle_product_status(product_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid product ID"})
    doc = await db.products.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Product not found"})
    new_status = not doc.get("is_active", True)
    await db.products.update_one({"_id": oid}, {"$set": {"is_active": new_status, "updated_at": datetime.now(timezone.utc)}})
    updated = await db.products.find_one({"_id": oid})
    return _fmt(updated)


@router.post(
    "/api/admin/add-product",
    status_code=status.HTTP_201_CREATED,
    summary="Create a product (frontend alias)",
    description="Identical to `POST /api/products`. Used by the React admin frontend. **Requires Bearer token.**",
)
async def admin_create_product(
    current_user: CurrentUser,
    name: str = Form(...),
    category: str = Form(...),
    brand: str = Form(...),
    price: float = Form(...),
    market_price: Optional[str] = Form(None),
    stock: Optional[str] = Form(None),
    description: str = Form(""),
    ecoFriendly: str = Form("false"),
    bestseller: str = Form("false"),
    order_type: Optional[str] = Form("both"),
    case_to_piece_qty: Optional[str] = Form(None),
    wholesale_price: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
):
    return await _handle_create(
        current_user, name, category, brand, price,
        market_price, stock, description, ecoFriendly, bestseller, images,
        order_type, case_to_piece_qty, wholesale_price,
    )


# ── GET /api/products ─────────────────────────────────────────────────────────

@router.get(
    "/api/get-products",
    summary="List products",
    description="Returns all active products. Supports optional filters and pagination.",
)
async def list_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    bestseller: Optional[bool] = None,
    eco_friendly: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
):
    db = get_db()
    query: dict = {"is_active": True}
    if category:
        query["category"] = category
    if brand:
        query["brand"] = brand
    if bestseller is not None:
        query["bestseller"] = bestseller
    if eco_friendly is not None:
        query["eco_friendly"] = eco_friendly

    cursor = db.products.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_fmt(d) for d in docs]


# ── GET /api/products/:id ─────────────────────────────────────────────────────

@router.get(
    "/api/get-product/{product_id}",
    summary="Get a product",
    description="Fetch a single product by its MongoDB ID.",
)
async def get_product(product_id: str):
    db = get_db()
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid product ID"})

    doc = await db.products.find_one({"_id": oid, "is_active": True})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Product not found"})

    return _fmt(doc)


# ── PUT /api/products/:id ─────────────────────────────────────────────────────

@router.put(
    "/api/update-product/{product_id}",
    summary="Update a product",
    description=(
        "Update product fields. Any omitted fields are left unchanged.\n\n"
        "New images are **appended** to existing media (existing images are not removed).\n\n"
        "**Requires Bearer token.**"
    ),
)
async def update_product(
    product_id: str,
    current_user: CurrentUser,
    name: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    market_price: Optional[str] = Form(None),
    stock: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    ecoFriendly: Optional[str] = Form(None),
    bestseller: Optional[str] = Form(None),
    order_type: Optional[str] = Form(None),
    case_to_piece_qty: Optional[str] = Form(None),
    wholesale_price: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
):
    db = get_db()
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid product ID"})

    existing = await db.products.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail={"message": "Product not found"})

    updates: dict = {"updated_at": datetime.now(timezone.utc)}
    if name is not None:
        updates["name"] = name
    if category is not None:
        updates["category"] = category
    if brand is not None:
        updates["brand"] = brand
    if price is not None:
        updates["price"] = price
    if market_price is not None:
        updates["market_price"] = _parse_optional_float(market_price)
    if stock is not None:
        updates["stock"] = _parse_optional_int(stock)
    if description is not None:
        updates["description"] = description
    if ecoFriendly is not None:
        updates["eco_friendly"] = _parse_bool(ecoFriendly)
    if bestseller is not None:
        updates["bestseller"] = _parse_bool(bestseller)
    if order_type is not None:
        updates["order_type"] = order_type
    if case_to_piece_qty is not None:
        updates["case_to_piece_qty"] = _parse_optional_int(case_to_piece_qty)
    if wholesale_price is not None:
        updates["wholesale_price"] = _parse_optional_float(wholesale_price)

    valid_images = [f for f in images if f.filename]
    if valid_images:
        new_media = await upload_files(valid_images)
        existing_media = existing.get("media", [])
        updates["media"] = existing_media + [m.model_dump() for m in new_media]

    await db.products.update_one({"_id": oid}, {"$set": updates})
    updated = await db.products.find_one({"_id": oid})
    return _fmt(updated)


# ── GET /api/get-wholesale-products ──────────────────────────────────────────

@router.get(
    "/api/get-wholesale-products",
    summary="List wholesale products",
    description="Returns all active products that have a wholesale price set.",
)
async def list_wholesale_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
):
    db = get_db()
    query: dict = {"is_active": True, "wholesale_price": {"$ne": None, "$exists": True}}
    if category:
        query["category"] = category
    if brand:
        query["brand"] = brand

    cursor = db.products.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_fmt(d) for d in docs]


# ── DELETE /api/products/:id ──────────────────────────────────────────────────

@router.delete(
    "/api/delete-product/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a product",
    description=(
        "Permanently deletes the product and all its associated Cloudinary images.\n\n"
        "**Requires Bearer token.**"
    ),
)
async def delete_product(product_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid product ID"})

    doc = await db.products.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Product not found"})

    if doc.get("media"):
        assets = [MediaAsset(**m) for m in doc["media"]]
        await delete_assets(assets)

    await db.products.delete_one({"_id": oid})
