from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pathlib import Path
from pydantic import BaseModel
from typing import List
import shutil
import os
from dotenv import load_dotenv
from google import genai


# ========================================
# Environment Variables
# ========================================

load_dotenv()


# ========================================
# Gemini Client
# ========================================

gemini_client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# ========================================
# Database Imports
# ========================================

from database import SessionLocal
from models import Document, AIQuery, Case, DocumentChunk


# ========================================
# FastAPI Application
# ========================================

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
# Chat Request Model
# ========================================

class ChatRequest(BaseModel):
    message: str


# ========================================
# Page Lock Request Model
# ========================================

class PageLockRequest(BaseModel):
    locked_pages: List[int] = []


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

    # ====================================
    # Save Physical File
    # ====================================

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # ====================================
    # Save Document Information
    # ====================================

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

    # ====================================
    # Find Document
    # ====================================

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    # ====================================
    # Document Not Found
    # ====================================

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # ====================================
    # Get Filename
    # ====================================

    filename = document.filename

    # ====================================
    # Delete Physical File
    # ====================================

    file_path = UPLOAD_DIR / filename

    if file_path.exists():
        file_path.unlink()

    # ====================================
    # Delete Database Record
    # ====================================

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

    # ====================================
    # Check Empty Query
    # ====================================

    if not query_data.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty"
        )

    # ====================================
    # Create AI Query
    # ====================================

    ai_query = AIQuery(
        query=query_data.query.strip()
    )

    # ====================================
    # Save to PostgreSQL
    # ====================================

    db.add(ai_query)
    db.commit()
    db.refresh(ai_query)

    return {
        "message": "AI query saved successfully",
        "query": ai_query.query,
        "query_id": ai_query.id,
        "created_at": ai_query.created_at
    }


# ========================================
# AI CHAT
# ========================================

@app.post("/chat")
def chat(
    chat_data: ChatRequest,
    db: Session = Depends(get_db)
):

    # ====================================
    # Check Empty Message
    # ====================================

    if not chat_data.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    # ====================================
    # Clean User Message
    # ====================================

    user_message = chat_data.message.strip()

    # ====================================
    # Save Chat Query to PostgreSQL
    # ====================================

    ai_query = AIQuery(
        query=user_message
    )

    db.add(ai_query)
    db.commit()
    db.refresh(ai_query)

    # ====================================
    # Generate Gemini AI Response
    # ====================================

    try:

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=(
                "You are LexAI, an AI legal assistant. "
                "Provide clear, concise and educational "
                "legal information. "
                "Do not claim to be a lawyer. "
                "Remind users that your response is "
                "general legal information and not a "
                "substitute for professional legal advice.\n\n"
                f"User question: {user_message}"
            )
        )

        ai_response = response.text

        if not ai_response:
            ai_response = (
                "I was unable to generate a response "
                "for your question."
            )

    except Exception as error:

        print(
            "Gemini API error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response."
        )

    # ====================================
    # Return Chat Response
    # ====================================

    return {
        "message": "Chat response generated successfully",
        "response": ai_response,
        "query_id": ai_query.id
    }


# ========================================
# Case Search
# ========================================

@app.get("/cases")
def get_cases(
    search: str = "",
    db: Session = Depends(get_db)
):

    query = db.query(Case)

    if search.strip():

        search_text = f"%{search.strip()}%"

        query = query.filter(
            (Case.case_number.ilike(search_text)) |
            (Case.title.ilike(search_text)) |
            (Case.court.ilike(search_text)) |
            (Case.case_type.ilike(search_text)) |
            (Case.description.ilike(search_text))
        )

    cases = query.order_by(
        Case.created_at.desc()
    ).all()

    return cases


# ========================================
# Get Case Count
# ========================================

@app.get("/cases/count")
def get_case_count(
    db: Session = Depends(get_db)
):

    count = db.query(Case).count()

    return {
        "count": count
    }


# ========================================
# Get Single Case
# ========================================

@app.get("/cases/{case_id}")
def get_case(
    case_id: int,
    db: Session = Depends(get_db)
):

    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if case is None:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    return case


# ========================================
# Create New Case
# ========================================

@app.post("/cases")
def create_case(
    case_number: str,
    title: str,
    court: str = "",
    case_type: str = "",
    description: str = "",
    status: str = "Active",
    db: Session = Depends(get_db)
):

    existing_case = db.query(Case).filter(
        Case.case_number == case_number
    ).first()

    if existing_case:
        raise HTTPException(
            status_code=400,
            detail="Case number already exists"
        )

    new_case = Case(
        case_number=case_number,
        title=title,
        court=court,
        case_type=case_type,
        description=description,
        status=status
    )

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    return new_case


# ========================================
# Update Case
# ========================================

@app.put("/cases/{case_id}")
def update_case(
    case_id: int,
    case_number: str,
    title: str,
    court: str = "",
    case_type: str = "",
    description: str = "",
    status: str = "Active",
    db: Session = Depends(get_db)
):

    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if case is None:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    existing_case = db.query(Case).filter(
        Case.case_number == case_number,
        Case.id != case_id
    ).first()

    if existing_case:
        raise HTTPException(
            status_code=400,
            detail="Case number already exists"
        )

    case.case_number = case_number
    case.title = title
    case.court = court
    case.case_type = case_type
    case.description = description
    case.status = status

    db.commit()
    db.refresh(case)

    return case


# ========================================
# Delete Case
# ========================================

@app.delete("/cases/{case_id}")
def delete_case(
    case_id: int,
    db: Session = Depends(get_db)
):

    case = db.query(Case).filter(
        Case.id == case_id
    ).first()

    if case is None:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    db.delete(case)
    db.commit()

    return {
        "message": "Case deleted successfully",
        "case_id": case_id
    }


# ========================================
# Extract Document Text
# ========================================

@app.get("/documents/{document_id}/text")
def get_document_text(
    document_id: int,
    db: Session = Depends(get_db)
):

    # Find document in database
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Physical file path
    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found"
        )

    # Import extractor
    from document_extractor import extract_document_text

    try:

        pages = extract_document_text(
            file_path
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Document extraction failed: {str(error)}"
        )

    return {
        "document_id": document.id,
        "filename": document.filename,
        "total_pages": len(pages),
        "pages": pages
    }


# ========================================
# Analyze Selected Document Pages
# ========================================

@app.post("/documents/{document_id}/analyze-pages")
def analyze_document_pages(
    document_id: int,
    request: PageLockRequest,
    db: Session = Depends(get_db)
):

    # Find document in database
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Build physical file path
    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Physical document file not found"
        )

    # Extract document text
    from document_extractor import extract_document_text

    try:

        pages = extract_document_text(
            file_path
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Document extraction failed: {str(error)}"
        )

    total_pages = len(pages)

    # Validate locked page numbers
    invalid_pages = [
        page
        for page in request.locked_pages
        if page < 1 or page > total_pages
    ]

    if invalid_pages:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid page number",
                "invalid_pages": invalid_pages,
                "total_pages": total_pages
            }
        )

    # Remove duplicate page numbers
    locked_pages = sorted(
        set(request.locked_pages)
    )

    # Select only pages that are NOT locked
    allowed_pages = [
        page
        for page in pages
        if page["page_number"] not in locked_pages
    ]

    return {
        "document_id": document_id,
        "filename": document.filename,
        "total_pages": total_pages,
        "locked_pages": locked_pages,
        "analyzed_pages": [
            page["page_number"]
            for page in allowed_pages
        ],
        "analyzed_page_count": len(allowed_pages),
        "pages": allowed_pages
    }

# ========================================
# Search Document Chunks
# ========================================

@app.get("/documents/{document_id}/chunks/search")
def search_document_chunks(
    document_id: int,
    query: str,
    db: Session = Depends(get_db)
):

    # ====================================
    # Check Document
    # ====================================

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # ====================================
    # Check Empty Query
    # ====================================

    if not query.strip():
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty"
        )

    # ====================================
    # Search Chunks
    # ====================================

    search_text = f"%{query.strip()}%"

    chunks = db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document_id,
        DocumentChunk.text.ilike(search_text)
    ).order_by(
        DocumentChunk.chunk_number
    ).all()

    # ====================================
    # Return Results
    # ====================================

    return {
        "document_id": document_id,
        "query": query.strip(),
        "total_results": len(chunks),
        "results": [
            {
                "chunk_id": chunk.id,
                "page_number": chunk.page_number,
                "chunk_number": chunk.chunk_number,
                "text": chunk.text
            }
            for chunk in chunks
        ]
    }


# ========================================
# Ask AI About Document
# ========================================

@app.post("/documents/{document_id}/ask")
def ask_document(
    document_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    # ====================================
    # Check Document
    # ====================================

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # ====================================
    # Check Empty Question
    # ====================================

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    user_question = request.message.strip()

    # ====================================
    # Find Relevant Document Chunks
    # ====================================

    search_words = user_question.lower().split()

    chunks = []

    for word in search_words:

        if len(word) < 3:
            continue

        search_text = f"%{word}%"

        results = db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id,
            DocumentChunk.text.ilike(search_text)
        ).order_by(
            DocumentChunk.chunk_number
        ).all()

        for chunk in results:

            if chunk not in chunks:
                chunks.append(chunk)

    # ====================================
    # No Relevant Chunks
    # ====================================

    if not chunks:

        raise HTTPException(
            status_code=404,
            detail="No relevant information found in the document."
        )

    # ====================================
    # Limit Context
    # ====================================

    chunks = chunks[:5]

    context = "\n\n".join(
        [
            f"Page {chunk.page_number}, "
            f"Chunk {chunk.chunk_number}:\n"
            f"{chunk.text}"
            for chunk in chunks
        ]
    )

    # ====================================
    # Ask Gemini
    # ====================================

    try:

        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=(
                "You are LexAI, an AI legal/document assistant.\n\n"
                "Answer the user's question using ONLY the "
                "provided document context.\n\n"
                "If the answer cannot be found in the context, "
                "clearly say that the information is not available "
                "in the document.\n\n"
                "Do not invent facts.\n\n"
                f"DOCUMENT CONTEXT:\n{context}\n\n"
                f"USER QUESTION:\n{user_question}"
            )
        )

        ai_response = response.text

        if not ai_response:

            ai_response = (
                "I was unable to generate an answer."
            )

    except Exception as error:

        print(
            "Gemini document analysis error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate document answer."
        )

    # ====================================
    # Return Answer
    # ====================================

    return {
        "message": "Document question answered successfully",
        "document_id": document_id,
        "question": user_question,
        "answer": ai_response,
        "sources": [
            {
                "chunk_id": chunk.id,
                "page_number": chunk.page_number,
                "chunk_number": chunk.chunk_number
            }
            for chunk in chunks
        ]
    }
