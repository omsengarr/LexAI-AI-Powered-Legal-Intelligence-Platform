from pathlib import Path

from pypdf import PdfReader
from docx import Document


# ========================================
# Extract PDF Text
# ========================================

def extract_pdf_text(file_path: Path):

    reader = PdfReader(str(file_path))

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):

        text = page.extract_text() or ""

        pages.append({
            "page_number": page_number,
            "text": text
        })

    return pages


# ========================================
# Extract DOCX Text
# ========================================

def extract_docx_text(file_path: Path):

    document = Document(str(file_path))

    paragraphs = []

    for paragraph in document.paragraphs:

        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    full_text = "\n".join(paragraphs)

    return [
        {
            "page_number": 1,
            "text": full_text
        }
    ]


# ========================================
# Extract TXT Text
# ========================================

def extract_txt_text(file_path: Path):

    text = file_path.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    return [
        {
            "page_number": 1,
            "text": text
        }
    ]


# ========================================
# Main Extraction Function
# ========================================

def extract_document_text(file_path: Path):

    extension = file_path.suffix.lower()

    if extension == ".pdf":

        return extract_pdf_text(file_path)

    elif extension == ".docx":

        return extract_docx_text(file_path)

    elif extension == ".txt":

        return extract_txt_text(file_path)

    else:

        raise ValueError(
            f"Unsupported file type: {extension}"
        )
