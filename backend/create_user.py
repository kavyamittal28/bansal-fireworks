"""
One-time script to create a specific admin user.

Usage:
    cd backend
    python create_user.py

Requires MONGODB_URL in backend/.env (or set as environment variable).
"""
import asyncio
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

USER_ID   = "Nikhilbnsl380@gmail.com"
PASSWORD  = "Nikhil@123"
NAME      = "Nikhil"

MONGODB_URL = os.environ.get("MONGODB_URL")
DB_NAME     = os.environ.get("DB_NAME", "bansal_fireworks")


async def create_user() -> None:
    if not MONGODB_URL:
        print("[error] MONGODB_URL is not set. Add it to backend/.env and retry.")
        return

    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    existing = await db.users.find_one({"user_id": USER_ID})
    if existing:
        print(f"[create_user] User with user_id={USER_ID} already exists. Skipping.")
        client.close()
        return

    hashed = bcrypt.hashpw(PASSWORD.encode("utf-8"), bcrypt.gensalt(rounds=12))
    doc = {
        "user_id": USER_ID,
        "name": NAME,
        "hashed_password": hashed.decode("utf-8"),
        "is_active": True,
    }
    result = await db.users.insert_one(doc)

    # Ensure unique index on user_id
    await db.users.create_index("user_id", unique=True)

    print(f"[create_user] Created user: name={NAME}, user_id={USER_ID}, _id={result.inserted_id}")
    client.close()


if __name__ == "__main__":
    asyncio.run(create_user())
