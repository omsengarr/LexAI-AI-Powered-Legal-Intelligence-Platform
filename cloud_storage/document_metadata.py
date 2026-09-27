import os
from datetime import datetime, timezone
from storage_service import get_content_type


def create_document_metadata(
    local_file_path,
    storage_path
):
    """
    Create metadata for an uploaded document.
    """

    if not os.path.exists(local_file_path):
        raise FileNotFoundError(
            f"Document not found: {local_file_path}"
        )

    file_name = os.path.basename(local_file_path)
    file_size = os.path.getsize(local_file_path)
    content_type = get_content_type(local_file_path)

    metadata = {
        "original_filename": file_name,
        "storage_path": storage_path,
        "content_type": content_type,
        "file_size": file_size,
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }

    return metadata