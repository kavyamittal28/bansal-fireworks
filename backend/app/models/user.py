from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserInDB(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    hashed_password: str
    name: str = "Admin"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def from_mongo(cls, doc: dict) -> "UserInDB":
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id"))
        return cls(**doc)
