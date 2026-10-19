
from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text, or_
from sqlalchemy.orm import Session

from database import Base, SessionLocal


router = APIRouter(prefix="/api/cases", tags=["Case Search"])


class LegalCase(Base):
    __tablename__ = "legal_cases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    court = Column(String(200), nullable=True, index=True)
    case_number = Column(String(200), nullable=True, index=True)
    citation = Column(String(200), nullable=True)
    decision_date = Column(String(50), nullable=True)
    topic = Column(String(300), nullable=True, index=True)
    summary = Column(Text, nullable=True)
    judgment_text = Column(Text, nullable=True)
    source_url = Column(String(1000), nullable=True)


class CaseResult(BaseModel):
    id: int
    title: str
    court: Optional[str] = None
    case_number: Optional[str] = None
    citation: Optional[str] = None
    decision_date: Optional[str] = None
    topic: Optional[str] = None
    summary: Optional[str] = None
    source_url: Optional[str] = None

    class Config:
        from_attributes = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/search", response_model=list[CaseResult])
def search_cases(
    q: str = Query(default="", max_length=200),
    court: Optional[str] = Query(default=None, max_length=200),
    topic: Optional[str] = Query(default=None, max_length=300),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(LegalCase)

    if q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                LegalCase.title.ilike(term),
                LegalCase.case_number.ilike(term),
                LegalCase.citation.ilike(term),
                LegalCase.topic.ilike(term),
                LegalCase.summary.ilike(term),
                LegalCase.judgment_text.ilike(term),
            )
        )

    if court:
        query = query.filter(LegalCase.court.ilike(f"%{court.strip()}%"))

    if topic:
        query = query.filter(LegalCase.topic.ilike(f"%{topic.strip()}%"))

    return query.order_by(LegalCase.id.desc()).limit(limit).all()


@router.get("/{case_id}", response_model=CaseResult)
def get_case(
    case_id: int,
    db: Session = Depends(get_db),
):
    from fastapi import HTTPException

    case = db.query(LegalCase).filter(LegalCase.id == case_id).first()

    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")

    return case
