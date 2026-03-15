from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class Inquiry(BaseModel):
    id: Optional[str] = None
    name: str
    phone: str
    requirement: str = "Wholesale Order"
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def from_mongo(cls, doc: dict) -> "Inquiry":
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id"))
        return cls(**doc)
