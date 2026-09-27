import os
import mimetypes


# Maximum allowed file size: 10 MB
MAX_FILE_SIZE = 10 * 1024 * 1024

# File extensions allowed by LexAI cloud storage
ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt"
}

# MIME types allowed by LexAI cloud storage
ALLOWED_CONTENT_TYPES = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain"
}


def validate_file(file_path):
    """
    Validate a document before uploading it to cloud storage.
    """

    # 1. Check that the file exists
    if not os.path.isfile(file_path):
        raise FileNotFoundError(
            f"Document not found: {file_path}"
        )

    # 2. Get extension
    extension = os.path.splitext(file_path)[1].lower()

    # 3. Check allowed extension
    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file type: {extension}. "
            f"Allowed types: PDF, DOCX, TXT."
        )

    # 4. Get file size
    file_size = os.path.getsize(file_path)

    # 5. Check file size
    if file_size > MAX_FILE_SIZE:
        raise ValueError(
            f"File is too large. Maximum allowed size is "
            f"{MAX_FILE_SIZE // (1024 * 1024)} MB."
        )

    # 6. Detect MIME type
    content_type, _ = mimetypes.guess_type(file_path)

    expected_content_type = ALLOWED_CONTENT_TYPES[extension]

    # 7. Verify MIME type
    if content_type != expected_content_type:
        raise ValueError(
            f"Invalid content type: {content_type}. "
            f"Expected: {expected_content_type}."
        )

    return {
        "valid": True,
        "filename": os.path.basename(file_path),
        "extension": extension,
        "content_type": content_type,
        "file_size": file_size
    }