from pydantic import BaseModel
from typing import Optional, List
from models.product import MediaAsset


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    market_price: Optional[float] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    eco_friendly: Optional[bool] = None
    bestseller: Optional[bool] = None
    order_type: Optional[str] = None
    case_to_piece_qty: Optional[int] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    brand: str
    price: float
    market_price: Optional[float] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    eco_friendly: bool
    bestseller: bool
    order_type: Optional[str] = None
    case_to_piece_qty: Optional[int] = None
    media: List[MediaAsset]
    is_active: bool
    created_at: str
    updated_at: str
