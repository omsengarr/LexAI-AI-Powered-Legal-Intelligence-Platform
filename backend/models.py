from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from datetime import datetime

from database import Base


# ========================================
# User Model
# ========================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        nullable=False,
        unique=True,
        index=True
    )

    password = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False,
        default="client"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ========================================
# Document Model
# ========================================

class Document(Base):

    __tablename__ = "documents"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    content_type = Column(
        String,
        nullable=True
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ========================================
# AI Query Model
# ========================================

class AIQuery(Base):

    __tablename__ = "ai_queries"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    query = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ========================================
# Case Model
# ========================================

class Case(Base):

    __tablename__ = "cases"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    case_number = Column(
        String,
        nullable=False,
        unique=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    court = Column(
        String,
        nullable=True
    )

    case_type = Column(
        String,
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    status = Column(
        String,
        nullable=True,
        default="Active"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ========================================
# Document Chunk Model
# ========================================

class DocumentChunk(Base):

    __tablename__ = "document_chunks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    document_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    page_number = Column(
        Integer,
        nullable=False
    )

    chunk_number = Column(
        Integer,
        nullable=False
    )

    text = Column(
        Text,
        nullable=False
    )


# ========================================
# AI Activity History Model
# ========================================

class AIActivityHistory(Base):

    __tablename__ = "ai_activity_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    activity_type = Column(
        String(50),
        nullable=False
    )

    title = Column(
        String(255),
        nullable=False
    )

    document_id = Column(
        Integer,
        nullable=True
    )

    document_name = Column(
        String(255),
        nullable=True
    )

    query = Column(
        Text,
        nullable=True
    )

    regulation = Column(
        String(100),
        nullable=True
    )

    status = Column(
        String(50),
        nullable=False,
        default="completed"
    )

    result = Column(
        JSON,
        nullable=True
    )

    error = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    completed_at = Column(
        DateTime,
        nullable=True
    )