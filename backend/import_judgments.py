
import hashlib
import re
from datetime import datetime
from pathlib import Path

from pypdf import PdfReader
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.exc import SQLAlchemyError

from database import Base, SessionLocal
from case_search import LegalCase


# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

DATASET_DIR = Path(
    r"C:\Users\omsen\Downloads\archive\supreme_court_judgments"
)

# First run imports at most 5 PDFs.
# Increase this only after verifying the test results.
BATCH_LIMIT = 5

COURT_NAME = "Supreme Court of India"


# --------------------------------------------------
# IMPORT TRACKING TABLE
# A separate table keeps existing legal_cases unchanged.
# --------------------------------------------------

class ImportedJudgment(Base):
    __tablename__ = "imported_judgments"

    id = Column(Integer, primary_key=True, index=True)
    fingerprint = Column(String(64), nullable=False, unique=True)
    source_path = Column(String(1500), nullable=False)
    legal_case_id = Column(Integer, nullable=True)
    imported_at = Column(DateTime, nullable=False, default=datetime.utcnow)


# --------------------------------------------------
# HELPERS
# --------------------------------------------------

def extract_text(pdf_path: Path) -> str:
    """Extract readable text from a PDF judgment."""
    reader = PdfReader(str(pdf_path))
    pages = []

    for page in reader.pages:
        try:
            text = page.extract_text() or ""
            if text.strip():
                pages.append(text)
        except Exception:
            continue

    return "\n\n".join(pages).strip()


def calculate_fingerprint(pdf_path: Path) -> str:
    """Fingerprint the file contents to prevent repeat imports."""
    digest = hashlib.sha256()

    with pdf_path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)

    return digest.hexdigest()


def clean_title(filename: str) -> str:
    """Create a readable title from a dataset filename."""
    name = Path(filename).stem
    name = re.sub(r"_on_", " on ", name, flags=re.IGNORECASE)
    name = name.replace("_", " ")
    name = re.sub(r"\s+", " ", name)
    name = re.sub(r"\s+\d+$", "", name)
    return name.strip(" -_")


def extract_metadata(text: str, pdf_path: Path) -> dict:
    """Extract conservative metadata; avoid guessing when absent."""
    title = clean_title(pdf_path.name)
    citation = None
    decision_date = None

    # Prefer a recognizable AIR/SCR citation when present.
    citation_match = re.search(
        r"\b\d{4}\s+AIR\s+\d+\b"
        r"(?:\s*,?\s*\d{4}\s+SCR\s+\d+\b)?",
        text,
        re.IGNORECASE,
    )

    if citation_match:
        citation = citation_match.group(0).strip()

    # Try the date included in the filename.
    date_match = re.search(
        r"\bon_(\d{1,2})_"
        r"(January|February|March|April|May|June|July|August|"
        r"September|October|November|December)_"
        r"(\d{4})",
        pdf_path.stem,
        re.IGNORECASE,
    )

    if date_match:
        try:
            parsed_date = datetime.strptime(
                " ".join(date_match.groups()),
                "%d %B %Y",
            )
            decision_date = parsed_date.strftime("%Y-%m-%d")
        except ValueError:
            pass

    # Keep title grounded in the filename.
    # Do not infer a date or citation if extraction failed.
    return {
        "title": title[:500] or pdf_path.stem[:500],
        "citation": citation[:200] if citation else None,
        "decision_date": decision_date,
    }


# --------------------------------------------------
# IMPORT
# --------------------------------------------------

def main():
    if not DATASET_DIR.exists():
        print(f"ERROR: Dataset folder not found: {DATASET_DIR}")
        return

    pdf_files = sorted(
        path for path in DATASET_DIR.rglob("*")
        if path.is_file() and path.suffix.lower() == ".pdf"
    )

    print(f"Dataset folder: {DATASET_DIR}")
    print(f"PDF files discovered: {len(pdf_files)}")

    if not pdf_files:
        print("No PDF files found. Nothing imported.")
        return

    Base.metadata.create_all(bind=__import__("database").engine)

    db = SessionLocal()
    imported = 0
    skipped = 0
    failed = 0

    try:
        for pdf_path in pdf_files:
            if imported >= BATCH_LIMIT:
                break

            try:
                fingerprint = calculate_fingerprint(pdf_path)

                already_imported = (
                    db.query(ImportedJudgment)
                    .filter(
                        ImportedJudgment.fingerprint == fingerprint
                    )
                    .first()
                )

                if already_imported:
                    skipped += 1
                    continue

                text = extract_text(pdf_path)

                if len(text) < 100:
                    print(f"SKIPPED (little/no text): {pdf_path.name}")
                    failed += 1
                    continue

                metadata = extract_metadata(text, pdf_path)

                # Save the judgment and tracking entry together.
                judgment = LegalCase(
                    title=metadata["title"],
                    court=COURT_NAME,
                    citation=metadata["citation"],
                    decision_date=metadata["decision_date"],
                    topic=None,
                    summary=None,
                    judgment_text=text,
                    # Local file path is not a public URL.
                    source_url=None,
                )

                db.add(judgment)
                db.flush()

                tracking = ImportedJudgment(
                    fingerprint=fingerprint,
                    source_path=str(pdf_path),
                    legal_case_id=judgment.id,
                )

                db.add(tracking)
                db.commit()

                imported += 1
                print(
                    f"IMPORTED {imported}/{BATCH_LIMIT}: "
                    f"{metadata['title']} (ID {judgment.id})"
                )

            except (SQLAlchemyError, Exception) as exc:
                db.rollback()
                failed += 1
                print(f"ERROR: {pdf_path.name}: {exc}")

        print("\n----------- IMPORT SUMMARY -----------")
        print(f"New judgments imported: {imported}")
        print(f"Previously imported files skipped: {skipped}")
        print(f"Failed or unreadable files: {failed}")
        print("--------------------------------------")

    finally:
        db.close()


if __name__ == "__main__":
    main()
