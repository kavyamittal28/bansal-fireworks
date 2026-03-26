from pydantic import BaseModel
from typing import Optional, List


class OrderItemCreate(BaseModel):
    productId: str
    name: str
    price: float
    type: str
    qty: int
    case_to_piece_qty: Optional[int] = None
    thumbnail: Optional[str] = None


class OrderCreate(BaseModel):
    name: str
    phone: str
    items: List[OrderItemCreate]
    total_amount: float
    total_pieces: int
