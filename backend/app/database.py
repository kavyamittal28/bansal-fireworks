from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import settings

_client: Optional[AsyncIOMotorClient] = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_url)
    return _client


def get_db() -> AsyncIOMotorDatabase:
    return get_client()[settings.db_name]


async def connect_db() -> None:
    client = get_client()
    await client.admin.command("ping")
    print("[db] MongoDB connected successfully")


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
        print("[db] MongoDB connection closed")
