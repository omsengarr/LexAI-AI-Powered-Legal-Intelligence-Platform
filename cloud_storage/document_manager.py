import os
import uuid

from storage_service import (
    upload_file,
    download_file,
    delete_file,
    list_files
)
from document_metadata import create_document_metadata
from document_validator import validate_file


def upload_document(local_file_path):
    """
    Validate, upload, and create metadata for a legal document.
    """

    # Validate the document before uploading
    validation = validate_file(local_file_path)

    file_name = validation["filename"]

    # Generate a unique ID
    unique_id = uuid.uuid4().hex

    # Keep the original filename readable
    storage_file_name = f"{unique_id}_{file_name}"

    storage_path = f"documents/{storage_file_name}"

    # Upload the validated document
    response = upload_file(
        local_file_path,
        storage_path
    )

    # Create metadata
    metadata = create_document_metadata(
        local_file_path,
        storage_path
    )

    # Add validation information to metadata
    metadata["validation"] = validation

    return {
        "metadata": metadata,
        "upload_response": response
    }


def download_document(storage_path, local_file_path):
    """
    Download a legal document from Supabase Storage.
    """

    return download_file(
        storage_path,
        local_file_path
    )


def delete_document(storage_path):
    """
    Delete a legal document from Supabase Storage.
    """

    return delete_file(storage_path)

def list_documents():
    """
    List all documents stored in Supabase Storage.
    """

    return list_files("documents")