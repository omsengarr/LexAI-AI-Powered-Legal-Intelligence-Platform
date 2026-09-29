from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import shutil
import os
import time
import json
import re
import requests
from dotenv import load_dotenv



# ========================================
# Environment Variables
# ========================================

load_dotenv()
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:latest")

# Ollama Cloud API authentication.
# If no API key is configured, the headers remain empty so local
# Ollama continues to work exactly as before.
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "").strip()
OLLAMA_HEADERS = (
    {"Authorization": f"Bearer {OLLAMA_API_KEY}"}
    if OLLAMA_API_KEY
    else {}
)

# ========================================
# Ollama Client
# ========================================




# ========================================
# Database Imports
# ========================================

from database import Base, SessionLocal, engine
from models import User, Document, AIQuery, Case, DocumentChunk


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

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
).rstrip("/")


ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


if FRONTEND_URL not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(FRONTEND_URL)


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
# Automatic Database Initialization
#
# Render Free Plan Compatible
#
# Creates missing tables and demo users
# automatically when the backend starts.
# ========================================

def initialize_database():

    print("Initializing LexAI database...")

    db = None

    try:

        # ------------------------------------
        # Create missing database tables
        # ------------------------------------

        Base.metadata.create_all(
            bind=engine
        )

        print(
            "Database tables initialized successfully."
        )

        # ------------------------------------
        # Open database session
        # ------------------------------------

        db = SessionLocal()

        # ------------------------------------
        # Demo users
        # ------------------------------------

        demo_users = [
            {
                "email": "admin@lexai.demo",
                "password": "demo",
                "role": "admin"
            },
            {
                "email": "lawyer@lexai.demo",
                "password": "demo",
                "role": "lawyer"
            },
            {
                "email": "researcher@lexai.demo",
                "password": "demo",
                "role": "legal_researcher"
            },
            {
                "email": "client@lexai.demo",
                "password": "demo",
                "role": "client"
            }
        ]

        # ------------------------------------
        # Create demo users if missing
        # ------------------------------------

        for user_data in demo_users:

            existing_user = (
                db.query(User)
                .filter(
                    User.email == user_data["email"]
                )
                .first()
            )

            if not existing_user:

                new_user = User(
                    email=user_data["email"],
                    password=user_data["password"],
                    role=user_data["role"]
                )

                db.add(new_user)

                print(
                    f"Created demo user: "
                    f"{user_data['email']}"
                )

        db.commit()

        print(
            "LexAI database initialization completed successfully."
        )

    except Exception as error:

        if db:
            db.rollback()

        print(
            "Database initialization failed:",
            error
        )

        raise

    finally:

        if db:
            db.close()


# ========================================
# Initialize Database on Startup
# ========================================

initialize_database()


# ========================================
# Login Request Model
# ========================================

class LoginRequest(BaseModel):
    email: str
    password: str


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
    locked_pages: List[int] = Field(
        default_factory=list
    )


# ========================================
# Risk Analysis Request Model
# ========================================

class RiskAnalysisRequest(BaseModel):
    locked_pages: List[int] = Field(
        default_factory=list
    )


# ========================================
# Compliance Analysis Request Model
# ========================================

class ComplianceRequest(BaseModel):
    regulation: str = "GDPR"
    locked_pages: List[int] = Field(
        default_factory=list
    )


# ========================================
# Helper: Parse Locked Pages
# ========================================

def parse_locked_pages(
    locked_pages: str
) -> List[int]:

    if not locked_pages.strip():
        return []

    try:

        parsed_pages = sorted(
            set(
                int(page.strip())
                for page in locked_pages.split(",")
                if page.strip()
            )
        )

    except ValueError:

        raise HTTPException(
            status_code=400,
            detail=(
                "locked_pages must contain "
                "comma-separated page numbers."
            )
        )

    return parsed_pages


# ========================================
# Helper: Validate Locked Pages
# ========================================

def validate_locked_pages(
    locked_pages: List[int],
    total_pages: int
):

    invalid_pages = [
        page
        for page in locked_pages
        if page < 1 or page > total_pages
    ]

    if invalid_pages:

        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid locked page number",
                "invalid_pages": invalid_pages,
                "total_pages": total_pages
            }
        )


# ========================================
# Login
# ========================================

@app.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    email = request.email.strip().lower()
    password = request.password.strip()

    if not password:

        raise HTTPException(
            status_code=400,
            detail="Password is required"
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Unauthorized user"
        )

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }


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

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

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
#
# Returns only the latest database record
# for each unique filename.
# This prevents duplicate documents from
# appearing in the frontend dropdown.
# ========================================

@app.get("/documents")
def get_documents(
    db: Session = Depends(get_db)
):

    documents = (
        db.query(Document)
        .order_by(
            Document.filename.asc(),
            Document.uploaded_at.desc()
        )
        .all()
    )

    unique_documents = []
    seen_filenames = set()

    for document in documents:

        filename = document.filename.strip()

        if filename in seen_filenames:
            continue

        seen_filenames.add(filename)
        unique_documents.append(document)

    # Keep newest documents first, matching
    # the previous API behavior.
    unique_documents.sort(
        key=lambda document: document.uploaded_at,
        reverse=True
    )

    return unique_documents


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

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if document is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    filename = document.filename

    file_path = UPLOAD_DIR / filename

    if file_path.exists():
        file_path.unlink()

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully",
        "document_id": document_id,
        "filename": filename
    }


# ========================================
# Compare Two Legal Cases
#
# Uses only the information stored in the
# selected case records.
# ========================================

class CaseComparisonRequest(BaseModel):
    case1_id: int
    case2_id: int


@app.post("/cases/compare")
def compare_cases(
    request: CaseComparisonRequest,
    db: Session = Depends(get_db)
):

    # ----------------------------------------
    # Prevent comparing the same case
    # ----------------------------------------

    if request.case1_id == request.case2_id:

        raise HTTPException(
            status_code=400,
            detail="Please select two different cases."
        )

    # ----------------------------------------
    # Fetch Case 1
    # ----------------------------------------

    case1 = (
        db.query(Case)
        .filter(
            Case.id == request.case1_id
        )
        .first()
    )

    if case1 is None:

        raise HTTPException(
            status_code=404,
            detail="Case 1 not found."
        )

    # ----------------------------------------
    # Fetch Case 2
    # ----------------------------------------

    case2 = (
        db.query(Case)
        .filter(
            Case.id == request.case2_id
        )
        .first()
    )

    if case2 is None:

        raise HTTPException(
            status_code=404,
            detail="Case 2 not found."
        )

    # ----------------------------------------
    # Build comparison context
    # ----------------------------------------

    case1_context = f"""
CASE 1

Case Number:
{case1.case_number}

Title:
{case1.title}

Court:
{case1.court or "Not available"}

Case Type:
{case1.case_type or "Not available"}

Status:
{case1.status or "Not available"}

Description:
{case1.description or "No description available"}

Created:
{case1.created_at}
"""

    case2_context = f"""
CASE 2

Case Number:
{case2.case_number}

Title:
{case2.title}

Court:
{case2.court or "Not available"}

Case Type:
{case2.case_type or "Not available"}

Status:
{case2.status or "Not available"}

Description:
{case2.description or "No description available"}

Created:
{case2.created_at}
"""

    # ----------------------------------------
    # Ollama prompt
    # ----------------------------------------

    prompt = f"""
You are LexAI, an AI-powered legal case
comparison assistant.

Compare the two case records provided below.

IMPORTANT:

Use ONLY the information explicitly provided
in the case records.

Do NOT:

- Invent facts.
- Invent judgments.
- Invent legal provisions.
- Invent court decisions.
- Assume facts that are not provided.
- Claim that the cases are legally related unless
  the provided information supports that conclusion.
- Present general legal knowledge as if it came
  from either case.

The available information may be limited.

If something cannot be determined from the
available information, clearly say so.

Analyze the cases across these areas:

1. Basic Information
2. Court and Case Type
3. Status
4. Description / Subject Matter
5. Similarities
6. Differences
7. Important Observations

Return ONLY valid JSON.

Use exactly this structure:

{{
  "overview": "Short neutral overview of the comparison.",
  "similarities": [
    "Similarity 1",
    "Similarity 2"
  ],
  "differences": [
    {{
      "category": "Category",
      "case1": "Case 1 information",
      "case2": "Case 2 information"
    }}
  ],
  "observations": [
    "Observation 1",
    "Observation 2"
  ]
}}

If there are no meaningful similarities,
return:

"similarities": []

If there are no meaningful differences,
return:

"differences": []

If there are no meaningful observations,
return:

"observations": []

Do not use Markdown.
Do not use JSON code fences.

CASE INFORMATION:

{case1_context}

{case2_context}
"""

    # ----------------------------------------
    # Ollama Interactions API
    # ----------------------------------------

    try:

        print(
            "ollama AI case comparison "
            "using Ollama API..."
        )

        ollama_response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            headers=OLLAMA_HEADERS,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json",
                "options": {
                    "temperature": 0.1
                }
            },
            timeout=180
        )

        ollama_response.raise_for_status()

        ollama_data = ollama_response.json()

        ai_result = ollama_data.get("response")

        if not ai_result:
            raise ValueError(
                "Ollama returned an empty comparison response."
            )

    except Exception as error:

        print(
            "Ollama case comparison error:",
            error
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "The LexAI AI comparison service is "
                "temporarily unavailable. "
                "Please try again in a moment."
            )
        )

    # ----------------------------------------
    # Parse JSON
    # ----------------------------------------

    import json
    import re

    cleaned_result = ai_result.strip()

    cleaned_result = re.sub(
        r"^```json\s*",
        "",
        cleaned_result,
        flags=re.IGNORECASE
    )

    cleaned_result = re.sub(
        r"^```\s*",
        "",
        cleaned_result
    )

    cleaned_result = re.sub(
        r"\s*```$",
        "",
        cleaned_result
    )

    cleaned_result = cleaned_result.strip()

    try:

        comparison_data = json.loads(
            cleaned_result
        )

    except json.JSONDecodeError:

        try:

            start_index = cleaned_result.find("{")
            end_index = cleaned_result.rfind("}")

            if (
                start_index == -1
                or end_index == -1
                or end_index <= start_index
            ):

                raise ValueError(
                    "No JSON object found."
                )

            comparison_data = json.loads(
                cleaned_result[
                    start_index:end_index + 1
                ]
            )

        except Exception as error:

            print(
                "Ollama returned invalid comparison JSON:",
                error
            )

            print(
                "Ollama raw comparison response:",
                ai_result
            )

            raise HTTPException(
                status_code=500,
                detail=(
                    "Ollama returned an invalid "
                    "case comparison response."
                )
            )

    # ----------------------------------------
    # Normalize response
    # ----------------------------------------

    overview = str(
        comparison_data.get(
            "overview",
            "No comparison overview was generated."
        )
    ).strip()

    raw_similarities = comparison_data.get(
        "similarities",
        []
    )

    if not isinstance(
        raw_similarities,
        list
    ):
        raw_similarities = []

    similarities = [
        str(item).strip()
        for item in raw_similarities
        if str(item).strip()
    ]

    raw_differences = comparison_data.get(
        "differences",
        []
    )

    if not isinstance(
        raw_differences,
        list
    ):
        raw_differences = []

    differences = []

    for item in raw_differences:

        if not isinstance(
            item,
            dict
        ):
            continue

        category = str(
            item.get(
                "category",
                "General"
            )
        ).strip()

        case1_information = str(
            item.get(
                "case1",
                "Not available"
            )
        ).strip()

        case2_information = str(
            item.get(
                "case2",
                "Not available"
            )
        ).strip()

        differences.append(
            {
                "category": (
                    category
                    or "General"
                ),
                "case1": (
                    case1_information
                    or "Not available"
                ),
                "case2": (
                    case2_information
                    or "Not available"
                )
            }
        )

    raw_observations = comparison_data.get(
        "observations",
        []
    )

    if not isinstance(
        raw_observations,
        list
    ):
        raw_observations = []

    observations = [
        str(item).strip()
        for item in raw_observations
        if str(item).strip()
    ]

    return {
        "success": True,
        "message": (
            "AI case comparison generated successfully."
        ),
        "case1": {
            "id": case1.id,
            "case_number": case1.case_number,
            "title": case1.title,
        },
        "case2": {
            "id": case2.id,
            "case_number": case2.case_number,
            "title": case2.title,
        },
        "comparison": {
            "overview": overview,
            "similarities": similarities,
            "differences": differences,
            "observations": observations,
        }
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

    if not query_data.query.strip():

        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty"
        )

    ai_query = AIQuery(
        query=query_data.query.strip()
    )

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
#
# DO NOT MODIFY
# ========================================

@app.post("/chat")
def chat(
    chat_data: ChatRequest,
    db: Session = Depends(get_db)
):

    if not chat_data.message.strip():

        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    user_message = chat_data.message.strip()

    ai_query = AIQuery(
        query=user_message
    )

    db.add(ai_query)
    db.commit()
    db.refresh(ai_query)

    prompt = (
        "You are LexAI, an AI legal assistant. "
        "Provide clear, concise and educational "
        "legal information. "
        "Do not claim to be a lawyer. "
        "Remind users that your response is "
        "general legal information and not a "
        "substitute for professional legal advice.\n\n"
        f"User question: {user_message}"
    )

    import requests

    try:
        print("Trying local Ollama model: llama3.2:latest")

        response = requests.post(
            OLLAMA_BASE_URL + "/api/generate",
            headers=OLLAMA_HEADERS,
            json={
                "model": OLLAMA_MODEL,
                "prompt": (
                    "You are LexAI, an AI legal assistant. "
                    "Provide clear, concise and educational "
                    "legal information. "
                    "Do not claim to be a lawyer. "
                    "Remind users that your response is "
                    "general legal information and not a "
                    "substitute for professional legal advice.\n\n"
                    f"User question: {user_message}"
                ),
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()

        ai_response = response.json().get("response")

        if not ai_response:
            raise Exception("Ollama returned an empty response")

        print("Ollama response generated successfully")

    except Exception as error:
        print("Ollama API error:", error)

        raise HTTPException(
            status_code=503,
            detail=(
                "The LexAI local AI service is temporarily "
                "unavailable. Please make sure Ollama is running."
            )
        )

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

    cases = (
        query
        .order_by(
            Case.created_at.desc()
        )
        .all()
    )

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

    case = (
        db.query(Case)
        .filter(
            Case.id == case_id
        )
        .first()
    )

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

    existing_case = (
        db.query(Case)
        .filter(
            Case.case_number == case_number
        )
        .first()
    )

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

    case = (
        db.query(Case)
        .filter(
            Case.id == case_id
        )
        .first()
    )

    if case is None:

        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    existing_case = (
        db.query(Case)
        .filter(
            Case.case_number == case_number,
            Case.id != case_id
        )
        .first()
    )

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

    case = (
        db.query(Case)
        .filter(
            Case.id == case_id
        )
        .first()
    )

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
#
# PRIVACY:
# locked_pages can be supplied as:
#
# /documents/3/text?locked_pages=2,4
#
# Locked pages are NOT returned.
# ========================================

@app.get("/documents/{document_id}/text")
def get_document_text(
    document_id: int,
    locked_pages: str = "",
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found"
        )

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
            detail=(
                f"Document extraction failed: {str(error)}"
            )
        )

    total_pages = len(pages)

    locked_page_numbers = parse_locked_pages(
        locked_pages
    )

    validate_locked_pages(
        locked_page_numbers,
        total_pages
    )

    accessible_pages = [
        page
        for page in pages
        if page["page_number"]
        not in locked_page_numbers
    ]

    return {
        "document_id": document.id,
        "filename": document.filename,
        "total_pages": total_pages,
        "locked_pages": locked_page_numbers,
        "accessible_page_count": len(accessible_pages),
        "pages": accessible_pages
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

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Physical document file not found"
        )

    from document_extractor import extract_document_text

    try:

        pages = extract_document_text(
            file_path
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Document extraction failed: {str(error)}"
            )
        )

    total_pages = len(pages)

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

    locked_pages = sorted(
        set(request.locked_pages)
    )

    allowed_pages = [
        page
        for page in pages
        if page["page_number"]
        not in locked_pages
    ]

    analyzed_page_numbers = [
        page["page_number"]
        for page in allowed_pages
    ]

    if not allowed_pages:

        return {
            "message": (
                "All document pages are locked. "
                "No AI analysis was performed."
            ),
            "document_id": document_id,
            "filename": document.filename,
            "total_pages": total_pages,
            "locked_pages": locked_pages,
            "analyzed_pages": [],
            "analyzed_page_count": 0,
            "analysis": None,
            "pages": []
        }

    analysis_context = "\n\n".join(
        [
            (
                f"PAGE {page['page_number']}:\n"
                f"{page.get('text', '').strip()}"
            )
            for page in allowed_pages
            if page.get("text", "").strip()
        ]
    )

    if not analysis_context.strip():

        return {
            "message": (
                "No readable text was found "
                "in the unlocked pages."
            ),
            "document_id": document_id,
            "filename": document.filename,
            "total_pages": total_pages,
            "locked_pages": locked_pages,
            "analyzed_pages": analyzed_page_numbers,
            "analyzed_page_count": len(allowed_pages),
            "analysis": None,
            "pages": allowed_pages
        }

    prompt = (
        "You are LexAI, an AI-powered "
        "legal/document intelligence assistant.\n\n"

        "Analyze ONLY the document pages provided below.\n\n"

        "IMPORTANT PRIVACY RULE:\n"
        "Only the provided unlocked pages are available "
        "for analysis. Do not assume or infer information "
        "from pages that were not provided.\n\n"

        "Provide a clear and structured analysis.\n\n"

        "Focus on:\n"
        "- Main topics\n"
        "- Important facts\n"
        "- Key points\n"
        "- Requirements\n"
        "- Dates\n"
        "- Entities\n"
        "- Decisions\n"
        "- Risks or important observations when supported "
        "by the provided text\n\n"

        "Do not invent information.\n"
        "Use ONLY the provided page text.\n\n"

        "UNLOCKED DOCUMENT PAGES:\n"
        f"{analysis_context}"
    )

    try:
        import requests

        print("Trying local Ollama model: llama3.2:latest")

        ollama_response = requests.post(
            OLLAMA_BASE_URL + "/api/generate",
            headers=OLLAMA_HEADERS,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        ollama_response.raise_for_status()

        analysis = ollama_response.json().get("response")

        if not analysis:
            raise Exception("Ollama returned an empty analysis")

        print("Ollama document analysis generated successfully")

    except Exception as error:

        print(
            "Ollama document analysis error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate document analysis."
        )

    return {
        "message": (
            "Document analysis generated successfully "
            "using unlocked pages only."
        ),
        "document_id": document_id,
        "filename": document.filename,
        "total_pages": total_pages,
        "locked_pages": locked_pages,
        "analyzed_pages": analyzed_page_numbers,
        "analyzed_page_count": len(allowed_pages),
        "analysis": analysis,
        "pages": allowed_pages
    }


# ========================================
# SUMMARIZE ENTIRE DOCUMENT
#
# PRIVACY:
# Only unlocked pages are sent to Ollama.
# ========================================

@app.post("/documents/{document_id}/summary")
def summarize_document(
    document_id: int,
    request: PageLockRequest,
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if document is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found"
        )

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

        print(
            "Document extraction error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Document extraction failed: {str(error)}"
            )
        )

    total_pages = len(pages)

    locked_pages = sorted(
        set(request.locked_pages)
    )

    validate_locked_pages(
        locked_pages,
        total_pages
    )

    unlocked_pages = [
        page
        for page in pages
        if page["page_number"]
        not in locked_pages
    ]

    if not unlocked_pages:

        raise HTTPException(
            status_code=400,
            detail=(
                "All pages are locked. "
                "Unlock at least one page "
                "before generating a summary."
            )
        )

    summary_context = "\n\n".join(
        [
            (
                f"--- PAGE {page['page_number']} ---\n"
                f"{page.get('text', '').strip()}"
            )
            for page in unlocked_pages
            if page.get("text", "").strip()
        ]
    )

    if not summary_context.strip():

        raise HTTPException(
            status_code=400,
            detail=(
                "No readable text was found "
                "in the unlocked pages."
            )
        )

    prompt = f"""
You are LexAI, an AI-powered legal document
intelligence assistant.

Create a clear, accurate and useful summary
of the document content provided below.

IMPORTANT PRIVACY RULE:

The user has intentionally locked some pages
of this document.

Only the pages included in the content below
are available for analysis.

You MUST NOT:

- Analyze locked pages.
- Infer information from locked pages.
- Guess what locked pages contain.
- Reconstruct missing information from locked pages.
- Mention information that could only come from
  locked pages.
- Assume that content missing from the provided
  pages exists elsewhere in the document.

Summarize ONLY the unlocked pages provided below.

Structure your response using the following format:

# Document Summary

## Overview

Give a concise overview of the document based
only on the available pages.

## Key Points

List the most important points, facts,
arguments, provisions, requirements, or concepts
found in the available pages.

## Important Details

Explain important information such as:

- Important facts
- Dates
- Parties or entities
- Requirements
- Obligations
- Decisions
- Terms
- Conditions
- Other significant information

Only include information actually supported
by the provided pages.

## Risks or Concerns

Identify important risks, concerns, ambiguities,
or issues that are actually visible in the
provided content.

Do not invent risks.

## Conclusion

Provide a concise conclusion based only on
the unlocked pages.

IMPORTANT:

Do not invent information.

If something cannot be determined from the
available pages, say that it cannot be determined
from the available content.

UNLOCKED DOCUMENT PAGES:

{summary_context}
"""

    import requests

    summary = None

    try:
        print("Trying local Ollama model: llama3.2:latest")

        ollama_response = requests.post(
            OLLAMA_BASE_URL + "/api/generate",
            headers=OLLAMA_HEADERS,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        ollama_response.raise_for_status()

        summary = ollama_response.json().get("response")

        if not summary:
            raise Exception("Ollama returned an empty summary")

        print("Ollama document summary generated successfully")

    except Exception as error:
        print("Ollama document summary error:", error)

        raise HTTPException(
            status_code=503,
            detail=(
                "The LexAI local AI service is temporarily "
                "unavailable. Please make sure Ollama is running."
            )
        )

    return {
        "success": True,
        "message": (
            "Document summary generated successfully "
            "using unlocked pages only."
        ),
        "document_id": document_id,
        "filename": document.filename,
        "total_pages": total_pages,
        "locked_pages": locked_pages,
        "summarized_pages": [
            page["page_number"]
            for page in unlocked_pages
        ],
        "summarized_page_count": len(
            unlocked_pages
        ),
        "summary": summary
    }


# ========================================
# AI RISK ANALYSIS
#
# PRIVACY:
# Only unlocked pages are sent to Ollama.
# ========================================

@app.post("/documents/{document_id}/risk-analysis")
def analyze_document_risk(
    document_id: int,
    request: RiskAnalysisRequest,
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if document is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found"
        )

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

        print(
            "Risk analysis document extraction error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Document extraction failed: {str(error)}"
            )
        )

    total_pages = len(pages)

    locked_pages = sorted(
        set(request.locked_pages)
    )

    validate_locked_pages(
        locked_pages,
        total_pages
    )

    unlocked_pages = [
        page
        for page in pages
        if page["page_number"]
        not in locked_pages
    ]

    analyzed_page_numbers = [
        page["page_number"]
        for page in unlocked_pages
    ]

    if not unlocked_pages:

        raise HTTPException(
            status_code=400,
            detail=(
                "All pages are locked. "
                "Unlock at least one page "
                "before running risk analysis."
            )
        )

    risk_context = "\n\n".join(
        [
            (
                f"--- PAGE {page['page_number']} ---\n"
                f"{page.get('text', '').strip()}"
            )
            for page in unlocked_pages
            if page.get("text", "").strip()
        ]
    )

    if not risk_context.strip():

        raise HTTPException(
            status_code=400,
            detail=(
                "No readable text was found "
                "in the unlocked pages."
            )
        )

    prompt = f"""
You are LexAI, an AI-powered legal document
risk analysis assistant.

Analyze ONLY the unlocked document pages
provided below.

IMPORTANT PRIVACY RULE:

Some pages were intentionally locked by the user.

The locked pages are NOT included in the content
you received.

You MUST:

- Analyze only the provided pages.
- Never infer information from locked pages.
- Never guess what locked pages contain.
- Never reconstruct information from missing pages.
- Never mention information that could only exist
  on locked pages.
- Never assume that missing information exists
  elsewhere in the document.
- Base every risk finding only on the provided text.

Your task is to identify potential legal,
contractual, compliance, financial, operational,
or document-related risks that are actually
supported by the available text.

Return ONLY valid JSON.

Do not use Markdown.
Do not use ```json fences.
Do not include explanations outside the JSON.

Use exactly this structure:

{{
  "overall_score": 0,
  "risk_level": "Low",
  "summary": "Short overall risk assessment.",
  "risks": [
    {{
      "title": "Risk or clause name",
      "severity": "Low",
      "page": 1,
      "description": "Explain the risk using only the provided text.",
      "recommendation": "Practical recommendation based only on the provided text."
    }}
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}}

SCORING RULES:

overall_score must be an integer from 0 to 100.

0-29 = Low
30-69 = Medium
70-100 = High

risk_level must be exactly one of:

Low
Medium
High

SEVERITY RULES:

Each risk severity must be exactly one of:

Low
Medium
High

PAGE RULES:

The page field must contain the actual page number
where the risk was identified.

If a risk is supported by more than one page,
use the most relevant page.

IMPORTANT:

Do not invent risks.

If the document has very few identifiable risks,
return only the risks that are actually supported.

If no meaningful risks are found, return:

"risks": []

and explain this in the summary.

Recommendations must be based only on the
available document content.

UNLOCKED DOCUMENT PAGES:

{risk_context}
"""

    import requests

    ai_result = None

    try:
        print("Starting Ollama risk analysis...")

        ollama_response = requests.post(
            OLLAMA_BASE_URL + "/api/generate",
            headers=OLLAMA_HEADERS,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json",
                "options": {
                    "temperature": 0.1
                }
            },
            timeout=300
        )

        ollama_response.raise_for_status()

        ai_result = ollama_response.json().get("response")

        if not ai_result or not ai_result.strip():
            raise ValueError(
                "Ollama returned an empty risk analysis."
            )

        print("Ollama risk analysis generated successfully.")

    except Exception as error:
        print("Ollama risk analysis error:", error)

        raise HTTPException(
            status_code=503,
            detail=(
                "The LexAI local AI service is temporarily "
                "unavailable. Please check that Ollama is running."
            )
        )

    cleaned_result = ai_result.strip()

    cleaned_result = re.sub(
        r"^```json\s*",
        "",
        cleaned_result,
        flags=re.IGNORECASE
    )

    cleaned_result = re.sub(
        r"^```\s*",
        "",
        cleaned_result
    )

    cleaned_result = re.sub(
        r"\s*```$",
        "",
        cleaned_result
    )

    cleaned_result = cleaned_result.strip()

    try:

        risk_data = json.loads(
            cleaned_result
        )

    except json.JSONDecodeError:

        try:

            start_index = cleaned_result.find("{")
            end_index = cleaned_result.rfind("}")

            if (
                start_index == -1
                or end_index == -1
                or end_index <= start_index
            ):

                raise ValueError(
                    "No JSON object found."
                )

            json_text = cleaned_result[
                start_index:end_index + 1
            ]

            risk_data = json.loads(
                json_text
            )

        except Exception as error:

            print(
                "Ollama returned invalid risk JSON:",
                error
            )

            print(
                "Ollama raw response:",
                ai_result
            )

            raise HTTPException(
                status_code=500,
                detail=(
                    "Ollama returned an invalid "
                    "risk analysis response."
                )
            )

    try:

        overall_score = int(
            risk_data.get(
                "overall_score",
                0
            )
        )

    except (
        TypeError,
        ValueError
    ):

        overall_score = 0

    overall_score = max(
        0,
        min(
            100,
            overall_score
        )
    )

    risk_level = str(
        risk_data.get(
            "risk_level",
            ""
        )
    ).strip().capitalize()

    if risk_level not in {
        "Low",
        "Medium",
        "High"
    }:

        if overall_score >= 70:
            risk_level = "High"

        elif overall_score >= 30:
            risk_level = "Medium"

        else:
            risk_level = "Low"

    summary = str(
        risk_data.get(
            "summary",
            "No risk summary was generated."
        )
    ).strip()

    raw_risks = risk_data.get(
        "risks",
        []
    )

    if not isinstance(
        raw_risks,
        list
    ):

        raw_risks = []

    normalized_risks = []

    for item in raw_risks:

        if not isinstance(
            item,
            dict
        ):

            continue

        title = str(
            item.get(
                "title",
                "Potential Risk"
            )
        ).strip()

        severity = str(
            item.get(
                "severity",
                "Medium"
            )
        ).strip().capitalize()

        if severity not in {
            "Low",
            "Medium",
            "High"
        }:

            severity = "Medium"

        try:

            page_number = int(
                item.get(
                    "page",
                    1
                )
            )

        except (
            TypeError,
            ValueError
        ):

            page_number = 1

        if page_number not in analyzed_page_numbers:

            page_number = (
                analyzed_page_numbers[0]
            )

        description = str(
            item.get(
                "description",
                ""
            )
        ).strip()

        recommendation = str(
            item.get(
                "recommendation",
                ""
            )
        ).strip()

        if not description:

            description = (
                "Potential issue identified "
                "in the available document content."
            )

        if not recommendation:

            recommendation = (
                "Review this issue with a "
                "qualified legal professional."
            )

        normalized_risks.append(
            {
                "title": title,
                "severity": severity,
                "page": page_number,
                "description": description,
                "recommendation": recommendation
            }
        )

    raw_recommendations = risk_data.get(
        "recommendations",
        []
    )

    if not isinstance(
        raw_recommendations,
        list
    ):

        raw_recommendations = []

    recommendations = []

    for recommendation in raw_recommendations:

        text = str(
            recommendation
        ).strip()

        if text:

            recommendations.append(
                text
            )

    return {
        "success": True,
        "message": (
            "AI risk analysis generated "
            "using unlocked pages only."
        ),
        "document_id": document_id,
        "filename": document.filename,
        "total_pages": total_pages,
        "locked_pages": locked_pages,
        "analyzed_pages": analyzed_page_numbers,
        "analyzed_page_count": len(
            analyzed_page_numbers
        ),
        "overall_score": overall_score,
        "risk_level": risk_level,
        "summary": summary,
        "risks": normalized_risks,
        "recommendations": recommendations
    }


# ========================================
# AI COMPLIANCE ANALYSIS
#
# PRIVACY:
# Only unlocked pages are sent to Ollama.
#
# Supported frameworks:
# GDPR
# DPDP
# HIPAA
# ========================================

@app.post("/documents/{document_id}/compliance")
def analyze_document_compliance(
    document_id: int,
    request: ComplianceRequest,
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    regulation = request.regulation.strip().upper()

    allowed_regulations = {
        "GDPR",
        "DPDP",
        "HIPAA"
    }

    if regulation not in allowed_regulations:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported regulation. "
                "Use GDPR, DPDP, or HIPAA."
            )
        )

    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found"
        )

    from document_extractor import extract_document_text

    try:
        pages = extract_document_text(file_path)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
    except Exception as error:
        print(
            "Compliance document extraction error:",
            error
        )
        raise HTTPException(
            status_code=500,
            detail="Document extraction failed."
        )

    total_pages = len(pages)

    locked_pages = sorted(
        set(request.locked_pages)
    )

    validate_locked_pages(
        locked_pages,
        total_pages
    )

    unlocked_pages = [
        page
        for page in pages
        if page["page_number"] not in locked_pages
    ]

    analyzed_page_numbers = [
        page["page_number"]
        for page in unlocked_pages
    ]

    if not unlocked_pages:
        raise HTTPException(
            status_code=400,
            detail=(
                "All pages are locked. "
                "Unlock at least one page "
                "before running compliance analysis."
            )
        )

    compliance_context = "\n\n".join(
        [
            (
                f"--- PAGE {page['page_number']} ---\n"
                f"{page.get('text', '').strip()}"
            )
            for page in unlocked_pages
            if page.get("text", "").strip()
        ]
    )

    if not compliance_context.strip():
        raise HTTPException(
            status_code=400,
            detail=(
                "No readable text was found "
                "in the unlocked pages."
            )
        )

    framework_instructions = {
        "GDPR": """
Evaluate privacy and data-protection provisions
relevant to GDPR that can reasonably be evaluated
from the document text, including where applicable:
data processing, lawful basis or consent, data
subject rights, right to erasure, data retention,
confidentiality, security, data sharing, and
controller/processor responsibilities.
""",
        "DPDP": """
Evaluate privacy and data-protection provisions
relevant to India's DPDP framework that can
reasonably be evaluated from the document text,
including where applicable: personal data processing,
consent, notice and transparency, data principal
rights, retention, security, sharing, data fiduciary
responsibilities, and grievance-related provisions.
""",
        "HIPAA": """
Evaluate provisions relevant to HIPAA privacy and
security obligations that can reasonably be evaluated
from the document text, including where applicable:
protected health information, privacy, permitted
disclosures, confidentiality, security safeguards,
access controls, data handling, and data sharing.
"""
    }

    prompt = f"""
You are LexAI, an AI-powered legal compliance
document analysis assistant.

Analyze ONLY the unlocked document pages provided
below.

Selected framework: {regulation}

{framework_instructions[regulation]}

IMPORTANT PRIVACY RULES:
- Locked pages are not available to you.
- Analyze only the provided unlocked pages.
- Never infer or guess information from locked pages.
- Never reconstruct missing information.
- Never use information from a locked page.
- Do not use general assumptions to claim a clause exists.

ANALYSIS RULES:
- Mark a check true only when the document contains
  reasonable supporting evidence.
- Mark a check false when the requirement is missing,
  insufficient, or unsupported by the available text.
- Use actual unlocked page numbers.
- Do not invent clauses, risks, or evidence.
- Recommendations must be based on the available text.
- This is an AI document analysis result, not a
  definitive legal opinion.

Return ONLY valid JSON with this exact structure:

{{
  "overall_score": 0,
  "compliance_level": "Needs Attention",
  "summary": "Short compliance assessment.",
  "checks": [
    {{
      "title": "Requirement name",
      "status": true,
      "page": 1,
      "description": "Evidence or explanation."
    }}
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}}

SCORING:
80-100 = Strong
60-79 = Good
40-59 = Needs Attention
0-39 = High Risk

compliance_level must be exactly:
Strong
Good
Needs Attention
High Risk

status must be true or false.

If a requirement is not supported by the available
document, status should be false and the description
should explain that supporting language was not found.

Do not use Markdown or JSON code fences.

UNLOCKED DOCUMENT PAGES:
{compliance_context}
"""

    # ----------------------------------------
    # Ollama API
    #
    # ollama-3.6-flash is currently available
    # for this API key through the Ollamas API.
    # ----------------------------------------

    ai_result = None

    try:
        print(
            "Trying Ollama API for "
            "compliance analysis using ollama-3.6-flash..."
        )
        ollama_response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            headers=OLLAMA_HEADERS,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json",
                "options": {
                    "temperature": 0.1
                }
            },
            timeout=180
        )

        ollama_response.raise_for_status()

        ollama_data = ollama_response.json()

        ai_result = ollama_data.get("response")

        if not ai_result:
            raise ValueError(
                "Ollama returned an empty compliance response."
            )

        print(
            "O compliance analysis generated "
            "successfully using configured Ollama model."
        )

    except Exception as error:
        print(
            "Ollama compliance analysis error:",
            error
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "The LexAI AI service is temporarily "
                "unavailable. Please try again in a moment."
            )
        )

    import json
    import re

    cleaned_result = ai_result.strip()

    cleaned_result = re.sub(
        r"^```json\s*",
        "",
        cleaned_result,
        flags=re.IGNORECASE
    )

    cleaned_result = re.sub(
        r"^```\s*",
        "",
        cleaned_result
    )

    cleaned_result = re.sub(
        r"\s*```$",
        "",
        cleaned_result
    )

    cleaned_result = cleaned_result.strip()

    try:
        compliance_data = json.loads(cleaned_result)

    except json.JSONDecodeError:
        try:
            start_index = cleaned_result.find("{")
            end_index = cleaned_result.rfind("}")

            if (
                start_index == -1
                or end_index == -1
                or end_index <= start_index
            ):
                raise ValueError(
                    "No JSON object found."
                )

            compliance_data = json.loads(
                cleaned_result[
                    start_index:end_index + 1
                ]
            )

        except Exception as error:
            print(
                "Ollama returned invalid compliance JSON:",
                error
            )
            print(
                "Ollama raw response:",
                ai_result
            )
            raise HTTPException(
                status_code=500,
                detail=(
                    "Ollama returned an invalid "
                    "compliance analysis response."
                )
            )

    try:
        overall_score = int(
            compliance_data.get(
                "overall_score",
                0
            )
        )
    except (TypeError, ValueError):
        overall_score = 0

    overall_score = max(
        0,
        min(100, overall_score)
    )

    compliance_level = str(
        compliance_data.get(
            "compliance_level",
            ""
        )
    ).strip()

    allowed_levels = {
        "Strong",
        "Good",
        "Needs Attention",
        "High Risk"
    }

    if compliance_level not in allowed_levels:
        if overall_score >= 80:
            compliance_level = "Strong"
        elif overall_score >= 60:
            compliance_level = "Good"
        elif overall_score >= 40:
            compliance_level = "Needs Attention"
        else:
            compliance_level = "High Risk"

    summary = str(
        compliance_data.get(
            "summary",
            "No compliance summary was generated."
        )
    ).strip()

    raw_checks = compliance_data.get(
        "checks",
        []
    )

    if not isinstance(raw_checks, list):
        raw_checks = []

    normalized_checks = []

    for item in raw_checks:
        if not isinstance(item, dict):
            continue

        title = str(
            item.get(
                "title",
                "Compliance Requirement"
            )
        ).strip()

        status = item.get(
            "status",
            False
        )

        if not isinstance(status, bool):
            status = (
                str(status).strip().lower()
                == "true"
            )

        try:
            page_number = int(
                item.get(
                    "page",
                    analyzed_page_numbers[0]
                )
            )
        except (
            TypeError,
            ValueError,
            IndexError
        ):
            page_number = (
                analyzed_page_numbers[0]
                if analyzed_page_numbers
                else 1
            )

        if (
            analyzed_page_numbers
            and page_number not in analyzed_page_numbers
        ):
            page_number = analyzed_page_numbers[0]

        description = str(
            item.get(
                "description",
                ""
            )
        ).strip()

        if not description:
            description = (
                "No additional explanation "
                "was provided."
            )

        normalized_checks.append(
            {
                "title": title,
                "status": status,
                "page": page_number,
                "description": description
            }
        )

    raw_recommendations = compliance_data.get(
        "recommendations",
        []
    )

    if not isinstance(raw_recommendations, list):
        raw_recommendations = []

    recommendations = []

    for recommendation in raw_recommendations:
        recommendation_text = str(
            recommendation
        ).strip()

        if recommendation_text:
            recommendations.append(
                recommendation_text
            )

    return {
        "success": True,
        "message": (
            "AI compliance analysis generated "
            "using unlocked pages only."
        ),
        "document_id": document_id,
        "filename": document.filename,
        "regulation": regulation,
        "total_pages": total_pages,
        "locked_pages": locked_pages,
        "analyzed_pages": analyzed_page_numbers,
        "analyzed_page_count": len(
            analyzed_page_numbers
        ),
        "overall_score": overall_score,
        "compliance_level": compliance_level,
        "summary": summary,
        "checks": normalized_checks,
        "recommendations": recommendations
    }


# ========================================
# Search Document Chunks
#
# PRIVACY:
# locked_pages can be supplied as:
#
# /documents/3/chunks/search?query=robot&locked_pages=2,4
#
# Locked page chunks are NOT returned.
# ========================================

@app.get("/documents/{document_id}/chunks/search")
def search_document_chunks(
    document_id: int,
    query: str,
    locked_pages: str = "",
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if document is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if not query.strip():

        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty"
        )

    locked_page_numbers = parse_locked_pages(
        locked_pages
    )

    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found"
        )

    from document_extractor import extract_document_text

    try:

        pages = extract_document_text(
            file_path
        )

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Document extraction failed."
        )

    total_pages = len(pages)

    validate_locked_pages(
        locked_page_numbers,
        total_pages
    )

    search_text = f"%{query.strip()}%"

    chunks = (
        db.query(DocumentChunk)
        .filter(
            DocumentChunk.document_id == document_id,
            DocumentChunk.text.ilike(search_text)
        )
        .order_by(
            DocumentChunk.chunk_number
        )
        .all()
    )

    accessible_chunks = [
        chunk
        for chunk in chunks
        if chunk.page_number
        not in locked_page_numbers
    ]

    return {
        "document_id": document_id,
        "query": query.strip(),
        "locked_pages": locked_page_numbers,
        "total_results": len(accessible_chunks),
        "results": [
            {
                "chunk_id": chunk.id,
                "page_number": chunk.page_number,
                "chunk_number": chunk.chunk_number,
                "text": chunk.text
            }
            for chunk in accessible_chunks
        ]
    }


# ========================================
# Ask AI About Document
# ========================================

@app.post("/documents/{document_id}/ask")
def ask_document(
    document_id: int,
    request: ChatRequest,
    locked_pages: str = "",
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if document is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if not request.message.strip():

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )

    user_question = request.message.strip()

    locked_page_numbers = parse_locked_pages(
        locked_pages
    )

    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found"
        )

    from document_extractor import extract_document_text

    try:

        pages = extract_document_text(
            file_path
        )

    except Exception as error:

        print(
            "Document extraction error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Document extraction failed."
        )

    total_pages = len(pages)

    validate_locked_pages(
        locked_page_numbers,
        total_pages
    )

    search_words = user_question.lower().split()

    chunks = []

    for word in search_words:

        if len(word) < 3:
            continue

        search_text = f"%{word}%"

        results = (
            db.query(DocumentChunk)
            .filter(
                DocumentChunk.document_id == document_id,
                DocumentChunk.text.ilike(search_text)
            )
            .order_by(
                DocumentChunk.chunk_number
            )
            .all()
        )

        for chunk in results:

            if chunk.page_number in locked_page_numbers:
                continue

            if chunk not in chunks:
                chunks.append(chunk)

    if not chunks:

        raise HTTPException(
            status_code=404,
            detail=(
                "No relevant information found in "
                "the unlocked document pages."
            )
        )

    chunks = chunks[:5]

    chunks = [
        chunk
        for chunk in chunks
        if chunk.page_number
        not in locked_page_numbers
    ]

    if not chunks:

        raise HTTPException(
            status_code=404,
            detail=(
                "No relevant information found "
                "outside the locked pages."
            )
        )

    context = "\n\n".join(
        [
            f"Page {chunk.page_number}, "
            f"Chunk {chunk.chunk_number}:\n"
            f"{chunk.text}"
            for chunk in chunks
        ]
    )

    prompt = (
        "Answer the user's question using only the following unlocked "
                "document excerpts. Do not use information from locked pages.\n\n"
                f"Question: {user_question}\n\n"
                f"Document excerpts:\n{context}"
    )

    try:
        import requests

        print("Starting Ollama document analysis...")

        ollama_response = requests.post(
            OLLAMA_BASE_URL + "/api/generate",
            headers=OLLAMA_HEADERS,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=300
        )

        ollama_response.raise_for_status()
        ai_response = ollama_response.json().get("response")

        if not ai_response:
            ai_response = (
                "I was unable to generate an answer "
                "for the unlocked pages."
            )

        print("Ollama document analysis generated successfully.")

    except Exception as error:

        print(
            "Ollama document analysis error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate document analysis."
        )

    return {
        "message": (
            "Document question answered successfully "
            "using unlocked pages only."
        ),
        "document_id": document_id,
        "question": user_question,
        "locked_pages": locked_page_numbers,
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


# ========================================
# Generate Page Summary
#
# NOTE:
# The frontend no longer uses this endpoint.
#
# It is kept here so existing API behavior
# does not break.
# ========================================

@app.post("/documents/{document_id}/pages/{page_number}/summary")
def summarize_document_page(
    document_id: int,
    page_number: int,
    request: PageLockRequest,
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if document is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    locked_pages = sorted(
        set(request.locked_pages)
    )

    if page_number in locked_pages:

        raise HTTPException(
            status_code=403,
            detail=(
                "This page is locked and cannot "
                "be analyzed or summarized."
            )
        )

    file_path = UPLOAD_DIR / document.filename

    if not file_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found"
        )

    from document_extractor import extract_document_text

    try:

        pages = extract_document_text(
            file_path
        )

    except Exception as error:

        print(
            "Document extraction error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Document extraction failed."
        )

    if page_number < 1 or page_number > len(pages):

        raise HTTPException(
            status_code=404,
            detail="Requested page not found."
        )

    selected_page = None

    for page in pages:

        if page["page_number"] == page_number:

            selected_page = page
            break

    if selected_page is None:

        raise HTTPException(
            status_code=404,
            detail="Requested page not found."
        )

    page_text = selected_page.get(
        "text",
        ""
    ).strip()

    if not page_text:

        raise HTTPException(
            status_code=400,
            detail="No text was extracted from this page."
        )

    try:
        import requests

        print("Trying local Ollama model: llama3.2:latest")

        ollama_response = requests.post(
            OLLAMA_BASE_URL + "/api/generate",
            headers=OLLAMA_HEADERS,
            json={
                "model": OLLAMA_MODEL,
                "prompt": (
                    "You are LexAI, an AI legal/document intelligence assistant.\n\n"
                    "Summarize the following document page clearly and concisely.\n\n"
                    "Focus on important facts, topics, requirements, dates, entities, "
                    "decisions, and other meaningful information present on the page.\n\n"
                    "Do not invent information.\n"
                    "Use ONLY the provided page text.\n\n"
                    f"PAGE {page_number} TEXT:\n"
                    f"{page_text}"
                ),
                "stream": False
            },
            timeout=120
        )

        ollama_response.raise_for_status()

        summary = ollama_response.json().get("response")

        if not summary:
            raise Exception("Ollama returned an empty summary")

        print("Ollama page summary generated successfully")

    except Exception as error:
        print("Ollama page summary error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate page summary."
        )
    return {
        "message": "Page summary generated successfully",
        "document_id": document_id,
        "filename": document.filename,
        "page_number": page_number,
        "summary": summary
    }