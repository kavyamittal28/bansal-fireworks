from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from bson import ObjectId
from datetime import datetime, timezone
from middleware.auth import get_current_user
from database import get_db
from schemas.brand import BrandCreate, BrandUpdate
from utils.media import upload_file

router = APIRouter(prefix="/api/brands", tags=["brands"])
CurrentUser = Annotated[dict, Depends(get_current_user)]


def _fmt(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    for field in ("created_at", "updated_at"):
        if hasattr(doc.get(field), "isoformat"):
            doc[field] = doc[field].isoformat()
    return doc


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Create a brand",
    description="Create a new brand. Slug must be unique. **Requires Bearer token.**",
)
async def create_brand(
    current_user: CurrentUser,
    name: str = Form(...),
    slug: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
):
    db = get_db()
    existing = await db.brands.find_one({"slug": slug})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"message": "Brand with this slug already exists"},
        )
    image_url = None
    image_public_id = None
    if image and image.filename:
        asset = await upload_file(image, folder="bansal-fireworks/brands")
        image_url = asset.url
        image_public_id = asset.public_id
    now = datetime.now(timezone.utc)
    doc = {
        "name": name, "slug": slug, "description": description,
        "image_url": image_url, "image_public_id": image_public_id,
        "is_active": True, "created_at": now, "updated_at": now,
    }
    result = await db.brands.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _fmt(doc)


@router.get(
    "",
    summary="List brands",
    description="Returns all active brands sorted alphabetically.",
)
async def list_brands():
    db = get_db()
    docs = await db.brands.find({"is_active": True}).sort("name", 1).to_list(length=200)
    return [_fmt(d) for d in docs]


@router.get(
    "/{brand_id}",
    summary="Get a brand",
    description="Fetch a single brand by its MongoDB ID.",
)
async def get_brand(brand_id: str):
    db = get_db()
    try:
        oid = ObjectId(brand_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid brand ID"})
    doc = await db.brands.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Brand not found"})
    return _fmt(doc)


@router.put(
    "/{brand_id}",
    summary="Update a brand",
    description="Update brand fields and/or image. Only provided fields are changed. **Requires Bearer token.**",
)
async def update_brand(
    brand_id: str,
    current_user: CurrentUser,
    name: Optional[str] = Form(None),
    slug: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    is_active: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    remove_image: Optional[str] = Form(None),
):
    db = get_db()
    try:
        oid = ObjectId(brand_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid brand ID"})

    existing = await db.brands.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail={"message": "Brand not found"})

    updates: dict = {"updated_at": datetime.now(timezone.utc)}
    if name is not None:
        updates["name"] = name
    if slug is not None:
        updates["slug"] = slug
    if description is not None:
        updates["description"] = description
    if is_active is not None:
        updates["is_active"] = is_active.lower() in ("true", "1", "yes")

    if image and image.filename:
        if existing.get("image_public_id"):
            from utils.media import delete_asset
            await delete_asset(existing["image_public_id"])
        asset = await upload_file(image, folder="bansal-fireworks/brands")
        updates["image_url"] = asset.url
        updates["image_public_id"] = asset.public_id
    elif remove_image and remove_image.lower() in ("true", "1", "yes"):
        if existing.get("image_public_id"):
            from utils.media import delete_asset
            await delete_asset(existing["image_public_id"])
        updates["image_url"] = None
        updates["image_public_id"] = None

    await db.brands.update_one({"_id": oid}, {"$set": updates})
    updated = await db.brands.find_one({"_id": oid})
    return _fmt(updated)


@router.delete(
    "/{brand_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a brand",
    description="Permanently delete a brand by ID. **Requires Bearer token.**",
)
async def delete_brand(brand_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(brand_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid brand ID"})

    result = await db.brands.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Brand not found"})
