from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from bson import ObjectId
from datetime import datetime, timezone
from ..middleware.auth import get_current_user
from ..database import get_db
from ..schemas.brand import BrandCreate, BrandUpdate
from ..utils.cloudinary import upload_file

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
    description="Update brand fields. Only provided fields are changed. **Requires Bearer token.**",
)
async def update_brand(brand_id: str, body: BrandUpdate, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(brand_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid brand ID"})

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)

    result = await db.brands.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Brand not found"})

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
