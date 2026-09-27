import os
import mimetypes
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
BUCKET_NAME = os.getenv("SUPABASE_BUCKET")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing from .env")

if not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_SECRET_KEY is missing from .env")

if not BUCKET_NAME:
    raise ValueError("SUPABASE_BUCKET is missing from .env")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)


def get_content_type(file_path):
    content_type, _ = mimetypes.guess_type(file_path)

    if content_type:
        return content_type

    return "application/octet-stream"


def upload_file(local_file_path, storage_path=None):
    if not os.path.exists(local_file_path):
        raise FileNotFoundError(
            f"File not found: {local_file_path}"
        )

    if storage_path is None:
        file_name = os.path.basename(local_file_path)
        storage_path = f"documents/{file_name}"

    content_type = get_content_type(local_file_path)

    file_options = {
        "content-type": content_type,
        "upsert": "false"
    }

    with open(local_file_path, "rb") as file:
        response = (
            supabase.storage
            .from_(BUCKET_NAME)
            .upload(
                path=storage_path,
                file=file,
                file_options=file_options
            )
        )

    return response


def download_file(storage_path, local_file_path):
    response = (
        supabase.storage
        .from_(BUCKET_NAME)
        .download(storage_path)
    )

    with open(local_file_path, "wb") as file:
        file.write(response)

    return local_file_path


def delete_file(storage_path):
    response = (
        supabase.storage
        .from_(BUCKET_NAME)
        .remove([storage_path])
    )

    return response
def list_files(folder="documents"):
    """
    List documents stored in Supabase Storage.
    """

    response = (
        supabase.storage
        .from_(BUCKET_NAME)
        .list(folder)
    )

    return response