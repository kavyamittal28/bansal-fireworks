from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone
from ..middleware.auth import get_current_user
from ..database import get_db
from ..schemas.category import CategoryCreate, CategoryUpdate

router = APIRouter(prefix="/api/categories", tags=["categories"])
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
    summary="Create a category",
    description="Create a new product category. Slug must be unique. **Requires Bearer token.**",
)
async def create_category(body: CategoryCreate, current_user: CurrentUser):
    db = get_db()
    existing = await db.categories.find_one({"slug": body.slug})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"message": "Category with this slug already exists"},
        )
    now = datetime.now(timezone.utc)
    doc = {**body.model_dump(), "is_active": True, "created_at": now, "updated_at": now}
    result = await db.categories.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _fmt(doc)


@router.get(
    "",
    summary="List categories",
    description="Returns all active categories sorted alphabetically.",
)
async def list_categories():
    db = get_db()
    docs = await db.categories.find({"is_active": True}).sort("name", 1).to_list(length=200)
    return [_fmt(d) for d in docs]


@router.get(
    "/{category_id}",
    summary="Get a category",
    description="Fetch a single category by its MongoDB ID.",
)
async def get_category(category_id: str):
    db = get_db()
    try:
        oid = ObjectId(category_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid category ID"})
    doc = await db.categories.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail={"message": "Category not found"})
    return _fmt(doc)


@router.put(
    "/{category_id}",
    summary="Update a category",
    description="Update category fields. Only provided fields are changed. **Requires Bearer token.**",
)
async def update_category(category_id: str, body: CategoryUpdate, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(category_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid category ID"})

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc)

    result = await db.categories.update_one({"_id": oid}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Category not found"})

    updated = await db.categories.find_one({"_id": oid})
    return _fmt(updated)


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a category",
    description="Permanently delete a category by ID. **Requires Bearer token.**",
)
async def delete_category(category_id: str, current_user: CurrentUser):
    db = get_db()
    try:
        oid = ObjectId(category_id)
    except Exception:
        raise HTTPException(status_code=400, detail={"message": "Invalid category ID"})

    result = await db.categories.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail={"message": "Category not found"})
