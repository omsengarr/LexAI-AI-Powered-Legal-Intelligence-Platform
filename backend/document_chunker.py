from typing import List, Dict


# ========================================
# Split Text Into Chunks
# ========================================

def split_text_into_chunks(
    text: str,
    chunk_size: int = 1000,
    overlap: int = 200
) -> List[str]:

    if not text:
        return []

    text = text.strip()

    if not text:
        return []

    chunks = []

    start = 0
    text_length = len(text)

    while start < text_length:

        end = start + chunk_size

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= text_length:
            break

        start = end - overlap

    return chunks


# ========================================
# Chunk Extracted Document Pages
# ========================================

def create_document_chunks(
    pages: List[Dict],
    document_id: int
) -> List[Dict]:

    chunks = []

    chunk_id = 1

    for page in pages:

        page_number = page["page_number"]
        page_text = page.get("text", "")

        page_chunks = split_text_into_chunks(
            page_text,
            chunk_size=1000,
            overlap=200
        )

        for chunk_text in page_chunks:

            chunks.append({
                "document_id": document_id,
                "page_number": page_number,
                "chunk_number": chunk_id,
                "text": chunk_text
            })

            chunk_id += 1

    return chunks
