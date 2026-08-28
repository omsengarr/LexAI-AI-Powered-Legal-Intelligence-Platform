from pathlib import Path

from database import SessionLocal
from document_extractor import extract_document_text
from document_chunker import create_document_chunks
from models import Document, DocumentChunk


def save_chunks(document_id, file_path, chunk_size=1000):
    db = SessionLocal()

    try:
        # ----------------------------------------
        # 1. Check document exists
        # ----------------------------------------
        document = db.query(Document).filter(
            Document.id == document_id
        ).first()

        if not document:
            print(f"Document with ID {document_id} not found.")
            return

        # ----------------------------------------
        # 2. Extract document text
        # ----------------------------------------
        print(f"Extracting text from: {file_path}")

        pages = extract_document_text(Path(file_path))

        print(f"Pages extracted: {len(pages)}")

        # ----------------------------------------
        # 3. Create chunks

        # ----------------------------------------
        chunks = create_document_chunks(
            pages,
            document_id
        )

        print(f"Chunks created: {len(chunks)}")

        # ----------------------------------------
        # 4. Save chunks to database
        # ----------------------------------------
        for chunk in chunks:

            db_chunk = DocumentChunk(
                document_id=chunk["document_id"],
                page_number=chunk["page_number"],
                chunk_number=chunk["chunk_number"],
                text=chunk["text"]
            )

            db.add(db_chunk)

        # ----------------------------------------
        # 5. Commit
        # ----------------------------------------
        db.commit()

        print("Chunks saved successfully!")

    except Exception as e:

        db.rollback()

        print("Error while saving chunks:")
        print(e)

    finally:

        db.close()


# ========================================
# RUN
# ========================================

if __name__ == "__main__":

    save_chunks(
        document_id=14,
        file_path="uploads/synopsis 2 project.docx",
        chunk_size=1000
    )
