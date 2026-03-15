from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class Brand(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def from_mongo(cls, doc: dict) -> "Brand":
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id"))
        return cls(**doc)
