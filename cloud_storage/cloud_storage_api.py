from document_manager import (
    upload_document,
    download_document,
    delete_document,
    list_documents
)


def upload(file_path):
    """
    Upload and validate a document.

    Supported:
    - PDF
    - DOCX
    - TXT
    """

    return upload_document(file_path)


def download(storage_path, destination_path):
    """
    Download a document from Supabase Storage.
    """

    return download_document(
        storage_path,
        destination_path
    )


def delete(storage_path):
    """
    Delete a document from Supabase Storage.
    """

    return delete_document(storage_path)


def list_all():
    """
    List all documents stored in Supabase.
    """

    return list_documents()