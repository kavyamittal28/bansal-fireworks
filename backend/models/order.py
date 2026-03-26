from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    type: str
    qty: int
    case_to_piece_qty: Optional[int] = None
    thumbnail: Optional[str] = None


class Order(BaseModel):
    id: Optional[str] = None
    name: str
    phone: str
    items: List[OrderItem]
    total_amount: float
    total_pieces: int
    status: str = "pending"
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def from_mongo(cls, doc: dict) -> "Order":
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id"))
        return cls(**doc)
