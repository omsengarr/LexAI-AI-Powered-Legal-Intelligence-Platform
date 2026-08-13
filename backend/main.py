from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pathlib import Path
from pydantic import BaseModel
import shutil

from database import SessionLocal
from models import Document, AIQuery


app = FastAPI(
    title="LexAI Backend",
    description="AI-Powered Legal Intelligence Platform Backend",
    version="1.0.0",
)


# ========================================
# CORS Configuration
# ========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================================
# Upload Folder
# ========================================

UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ========================================
# Database Session
# ========================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ========================================
# AI Query Request Model
# ========================================

class AIQueryRequest(BaseModel):
    query: str


# ========================================
# Root Endpoint
# ========================================

@app.get("/")
def root():
    return {
        "message": "LexAI Backend is running"
    }


# ========================================
# Health Check
# ========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ========================================
# Document Upload
# ========================================

@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Check that a filename exists
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    # Save the actual file
    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Save document information in PostgreSQL
    document = Document(
        filename=file.filename,
        content_type=file.content_type
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "content_type": file.content_type,
        "saved_path": str(file_path),
        "document_id": document.id
    }


# ========================================
# Get All Documents
# ========================================

@app.get("/documents")
def get_documents(
    db: Session = Depends(get_db)
):

    documents = db.query(Document).order_by(
        Document.uploaded_at.desc()
    ).all()

    return documents


# ========================================
# Get Document Count
# ========================================

@app.get("/documents/count")
def get_document_count(
    db: Session = Depends(get_db)
):

    count = db.query(Document).count()

    return {
        "count": count
    }


# ========================================
# Delete Document
# ========================================

@app.delete("/documents/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    # Find document in PostgreSQL
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    # Document does not exist
    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Get filename before deleting database record
    filename = document.filename

    # Delete the physical file
    file_path = UPLOAD_DIR / filename

    if file_path.exists():
        file_path.unlink()

    # Delete database record
    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully",
        "document_id": document_id,
        "filename": filename
    }


# ========================================
# Get AI Query Count
# ========================================

@app.get("/queries/count")
def get_ai_query_count(
    db: Session = Depends(get_db)
):

    count = db.query(AIQuery).count()

    return {
        "count": count
    }


# ========================================
# Save AI Query
# ========================================

@app.post("/queries")
def save_ai_query(
    query_data: AIQueryRequest,
    db: Session = Depends(get_db)
):

    # Check that query is not empty
    if not query_data.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty"
        )

    # Create new AI query record
    ai_query = AIQuery(
        query=query_data.query.strip()
    )

    # Save to PostgreSQL
    db.add(ai_query)
    db.commit()
    db.refresh(ai_query)

    return {
        "message": "AI query saved successfully",
        "query": ai_query.query,
        "query_id": ai_query.id,
        "created_at": ai_query.created_at
    }