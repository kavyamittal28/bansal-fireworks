from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from bson import ObjectId
from datetime import datetime, timezone
from middleware.auth import get_current_user
from database import get_db
from models.product import MediaAsset
from utils.cloudinary import upload_files, delete_assets

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


# ── Shared create handler ─────────────────────────────────────────────────────

async def _handle_create(
    current_user: dict,
    name: str,
    category: str,
    brand: str,
    price: float,
    market_price: Optional[float],
    stock: Optional[int],
    description: str,
    eco_friendly_str: str,
    bestseller_str: str,
    images: List[UploadFile],
) -> dict:
    db = get_db()

    media: List[MediaAsset] = []
    valid_images = [f for f in images if f.filename]
    if valid_images:
        media = await upload_files(valid_images)

    now = datetime.now(timezone.utc)
    doc = {
        "name": name,
        "category": category,
        "brand": brand,
        "price": price,
        "market_price": market_price,
        "stock": stock,
        "description": description,
        "eco_friendly": _parse_bool(eco_friendly_str) or False,
        "bestseller": _parse_bool(bestseller_str) or False,
        "media": [m.model_dump() for m in media],
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.products.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _fmt(doc)


# ── POST /api/products ────────────────────────────────────────────────────────

@router.post(
    "/api/products",
    status_code=status.HTTP_201_CREATED,
    summary="Create a product",
    description=(
        "Create a new product. Accepts `multipart/form-data` with optional image files.\n\n"
        "Images are uploaded to Cloudinary automatically.\n\n"
        "**Requires Bearer token.**"
    ),
)
async def create_product(
    current_user: CurrentUser,
    name: str = Form(..., description="Product name"),
    category: str = Form(..., description="Category (e.g. Sparklers, Aerial Shows)"),
    brand: str = Form(..., description="Brand name"),
    price: float = Form(..., description="Price per unit in INR"),
    market_price: Optional[float] = Form(None, description="Market / MRP in INR"),
    stock: Optional[int] = Form(None, description="Available stock quantity"),
    description: str = Form("", description="Full product description"),
    ecoFriendly: str = Form("false", description='"true" or "false"'),
    bestseller: str = Form("false", description='"true" or "false"'),
    images: List[UploadFile] = File(default=[], description="Product images (PNG/JPG/WebP, max 5 MB each)"),
):
    return await _handle_create(
        current_user, name, category, brand, price,
        market_price, stock, description, ecoFriendly, bestseller, images,
    )


@router.get(
    "/api/admin/products",
    summary="List all products (admin)",
    description="Returns all products including inactive ones. **Requires Bearer token.**",
)
async def admin_list_products(current_user: CurrentUser, skip: int = 0, limit: int = 100):
    db = get_db()
    cursor = db.products.find({}).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_fmt(d) for d in docs]


@router.patch(
    "/api/admin/products/{product_id}/toggle",
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
    "/api/admin/products",
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
    market_price: Optional[float] = Form(None),
    stock: Optional[int] = Form(None),
    description: str = Form(""),
    ecoFriendly: str = Form("false"),
    bestseller: str = Form("false"),
    images: List[UploadFile] = File(default=[]),
):
    return await _handle_create(
        current_user, name, category, brand, price,
        market_price, stock, description, ecoFriendly, bestseller, images,
    )


# ── GET /api/products ─────────────────────────────────────────────────────────

@router.get(
    "/api/products",
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
    "/api/products/{product_id}",
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
    "/api/products/{product_id}",
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
    market_price: Optional[float] = Form(None),
    stock: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    ecoFriendly: Optional[str] = Form(None),
    bestseller: Optional[str] = Form(None),
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
        updates["market_price"] = market_price
    if stock is not None:
        updates["stock"] = stock
    if description is not None:
        updates["description"] = description
    if ecoFriendly is not None:
        updates["eco_friendly"] = _parse_bool(ecoFriendly)
    if bestseller is not None:
        updates["bestseller"] = _parse_bool(bestseller)

    valid_images = [f for f in images if f.filename]
    if valid_images:
        new_media = await upload_files(valid_images)
        existing_media = existing.get("media", [])
        updates["media"] = existing_media + [m.model_dump() for m in new_media]

    await db.products.update_one({"_id": oid}, {"$set": updates})
    updated = await db.products.find_one({"_id": oid})
    return _fmt(updated)


# ── DELETE /api/products/:id ──────────────────────────────────────────────────

@router.delete(
    "/api/products/{product_id}",
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
