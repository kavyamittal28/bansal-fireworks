import asyncio
import logging
from typing import List
import cloudinary.uploader
from fastapi import UploadFile
from models.product import MediaAsset

logger = logging.getLogger(__name__)


async def upload_file(
    file: UploadFile,
    folder: str = "bansal-fireworks/products",
) -> MediaAsset:
    """
    Upload a single file to Cloudinary.
    The Cloudinary SDK is synchronous, so we offload it to a thread pool
    executor to avoid blocking the asyncio event loop.
    """
    content = await file.read()
    if not content:
        logger.warning("[cloudinary] Empty file skipped: %s", file.filename)
        return None

    content_type = file.content_type or ""
    resource_type = "video" if content_type.startswith("video/") else "image"

    logger.info("[cloudinary] Uploading %s (%s, %d bytes)", file.filename, resource_type, len(content))

    loop = asyncio.get_running_loop()

    def _upload():
        return cloudinary.uploader.upload(
            content,
            folder=folder,
            resource_type=resource_type,
            quality="auto",
            fetch_format="auto",
        )

    try:
        result = await loop.run_in_executor(None, _upload)
    except Exception as e:
        logger.error("[cloudinary] Upload FAILED for %s: %s", file.filename, e)
        raise

    logger.info("[cloudinary] Upload OK: %s -> %s", file.filename, result.get("secure_url", "?"))

    return MediaAsset(
        url=result["secure_url"],
        public_id=result["public_id"],
        resource_type=resource_type,
    )


async def upload_files(
    files: List[UploadFile],
    folder: str = "bansal-fireworks/products",
) -> List[MediaAsset]:
    """Upload multiple files concurrently."""
    tasks = [upload_file(f, folder) for f in files]
    results = await asyncio.gather(*tasks)
    return [r for r in results if r is not None]


async def delete_asset(public_id: str, resource_type: str = "image") -> None:
    """Delete a single Cloudinary asset in a thread pool."""
    loop = asyncio.get_running_loop()

    def _delete():
        cloudinary.uploader.destroy(public_id, resource_type=resource_type)

    await loop.run_in_executor(None, _delete)


async def delete_assets(assets: List[MediaAsset]) -> None:
    """
    Delete multiple Cloudinary assets concurrently.
    return_exceptions=True prevents one failed delete from cancelling others.
    """
    tasks = [delete_asset(a.public_id, a.resource_type) for a in assets]
    await asyncio.gather(*tasks, return_exceptions=True)
