from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class MediaAsset(BaseModel):
    url: str
    public_id: str
    resource_type: str = "image"  # "image" or "video"


class Product(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    brand: str
    price: float
    market_price: Optional[float] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    eco_friendly: bool = False
    bestseller: bool = False
    media: List[MediaAsset] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def from_mongo(cls, doc: dict) -> "Product":
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id"))
        return cls(**doc)
