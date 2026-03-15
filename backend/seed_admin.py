"""
Seed script to create the initial admin user.

Usage:
    cd backend
    python seed_admin.py --email admin@bansalfireworks.com --password YourStrongPass123

Run this once after setting up your .env file.
"""
import asyncio
import argparse
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.environ.get("MONGODB_URL")
DB_NAME = os.environ.get("DB_NAME", "bansal_fireworks")


async def create_admin(email: str, password: str, name: str = "Admin") -> None:
    if not MONGODB_URL:
        print("[error] MONGODB_URL is not set in .env")
        return

    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    existing = await db.users.find_one({"email": email.lower()})
    if existing:
        print(f"[seed] User {email} already exists. Skipping.")
        client.close()
        return

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12))
    doc = {
        "email": email.lower(),
        "hashed_password": hashed.decode("utf-8"),
        "name": name,
        "is_active": True,
    }
    result = await db.users.insert_one(doc)

    # Create unique index on email (idempotent)
    await db.users.create_index("email", unique=True)

    print(f"[seed] Created admin user: {email} (id={result.inserted_id})")
    client.close()


async def create_indexes() -> None:
    """Create recommended MongoDB indexes."""
    if not MONGODB_URL:
        return
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    await db.users.create_index("email", unique=True)
    await db.brands.create_index("slug", unique=True)
    await db.categories.create_index("slug", unique=True)
    await db.products.create_index("category")
    await db.products.create_index("brand")
    await db.products.create_index([("created_at", -1)])

    print("[seed] MongoDB indexes created.")
    client.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed admin user and create DB indexes")
    parser.add_argument("--email", required=True, help="Admin email address")
    parser.add_argument("--password", required=True, help="Admin password")
    parser.add_argument("--name", default="Admin", help="Admin display name")
    parser.add_argument("--indexes-only", action="store_true", help="Only create indexes, skip user creation")
    args = parser.parse_args()

    if args.indexes_only:
        asyncio.run(create_indexes())
    else:
        asyncio.run(create_admin(args.email, args.password, args.name))
        asyncio.run(create_indexes())
