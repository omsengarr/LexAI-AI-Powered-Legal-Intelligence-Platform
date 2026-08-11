from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pathlib import Path
import shutil

from database import SessionLocal
from models import Document


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

    # Save the actual file
    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

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