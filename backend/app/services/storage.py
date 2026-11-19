"""Storage service: S3/R2 upload, download, delete, and signed URL generation.

Falls back to local filesystem storage when AWS credentials are not configured.
"""
import io
import os
import uuid
from pathlib import Path
from typing import Optional
import logging

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.config import settings

logger = logging.getLogger(__name__)

LOCAL_STORAGE_DIR = Path("./local_storage")


def _get_s3_client():
    """Return a boto3 S3 client configured for S3 or Cloudflare R2."""
    if not settings.AWS_ACCESS_KEY_ID:
        return None
    kwargs = dict(
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )
    if settings.R2_ENDPOINT_URL:
        kwargs["endpoint_url"] = settings.R2_ENDPOINT_URL
    return boto3.client("s3", **kwargs)


class StorageService:
    """Unified storage abstraction over S3/R2 with local fallback."""

    def __init__(self):
        self.client = _get_s3_client()
        self.bucket = settings.S3_BUCKET_NAME
        self.use_local = self.client is None
        if self.use_local:
            LOCAL_STORAGE_DIR.mkdir(parents=True, exist_ok=True)
            logger.warning("S3/R2 credentials not configured — using local filesystem storage")

    # ------------------------------------------------------------------
    # Upload
    # ------------------------------------------------------------------

    async def upload_file(
        self,
        file_data: bytes,
        file_key: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        """Upload raw bytes to storage and return the public/CDN URL."""
        if self.use_local:
            return self._local_upload(file_data, file_key)
        try:
            self.client.put_object(
                Bucket=self.bucket,
                Key=file_key,
                Body=file_data,
                ContentType=content_type,
            )
            return self._build_url(file_key)
        except (BotoCoreError, ClientError) as exc:
            logger.error("S3 upload failed: %s", exc)
            raise

    def _local_upload(self, data: bytes, key: str) -> str:
        """Save file to local_storage directory."""
        dest = LOCAL_STORAGE_DIR / key
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return f"/local_storage/{key}"

    # ------------------------------------------------------------------
    # Download
    # ------------------------------------------------------------------

    async def download_file(self, file_key: str) -> bytes:
        """Download and return the raw bytes for the given key."""
        if self.use_local:
            return (LOCAL_STORAGE_DIR / file_key).read_bytes()
        try:
            response = self.client.get_object(Bucket=self.bucket, Key=file_key)
            return response["Body"].read()
        except (BotoCoreError, ClientError) as exc:
            logger.error("S3 download failed: %s", exc)
            raise

    # ------------------------------------------------------------------
    # Delete
    # ------------------------------------------------------------------

    async def delete_file(self, file_key: str) -> None:
        """Delete an object from storage."""
        if self.use_local:
            path = LOCAL_STORAGE_DIR / file_key
            if path.exists():
                path.unlink()
            return
        try:
            self.client.delete_object(Bucket=self.bucket, Key=file_key)
        except (BotoCoreError, ClientError) as exc:
            logger.error("S3 delete failed: %s", exc)
            raise

    # ------------------------------------------------------------------
    # Signed URLs
    # ------------------------------------------------------------------

    def generate_presigned_upload_url(
        self, file_key: str, content_type: str, expires_in: int = 3600
    ) -> str:
        """Generate a pre-signed PUT URL for direct client-side uploads."""
        if self.use_local:
            return f"/api/v1/videos/upload-local?key={file_key}"
        return self.client.generate_presigned_url(
            "put_object",
            Params={"Bucket": self.bucket, "Key": file_key, "ContentType": content_type},
            ExpiresIn=expires_in,
        )

    def generate_presigned_download_url(self, file_key: str, expires_in: int = 3600) -> str:
        """Generate a pre-signed GET URL for secure downloads."""
        if self.use_local:
            return f"/local_storage/{file_key}"
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": file_key},
            ExpiresIn=expires_in,
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _build_url(self, key: str) -> str:
        """Build a public URL for an S3/R2 object."""
        if settings.CDN_BASE_URL:
            return f"{settings.CDN_BASE_URL.rstrip('/')}/{key}"
        if settings.R2_ENDPOINT_URL:
            return f"{settings.R2_ENDPOINT_URL}/{self.bucket}/{key}"
        return f"https://{self.bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

    @staticmethod
    def generate_file_key(prefix: str, filename: str) -> str:
        """Generate a unique storage key: prefix/uuid-filename."""
        ext = Path(filename).suffix.lower()
        return f"{prefix}/{uuid.uuid4()}{ext}"


storage_service = StorageService()
