
from pathlib import Path
from pypdf import PdfReader
import re

DATASET_DIR = Path(
    r"C:\Users\omsen\Downloads\archive\supreme_court_judgments"
)

def extract_sample(pdf_path):
    print("\n" + "=" * 75)
    print("FILE:", pdf_path.name)
    print("FOLDER:", pdf_path.parent.name)

    try:
        reader = PdfReader(str(pdf_path))
        pages = reader.pages[:3]

        text = "\n".join(
            page.extract_text() or ""
            for page in pages
        ).strip()

        print("PAGES IN PDF:", len(reader.pages))

        lines = [
            re.sub(r"\s+", " ", line).strip()
            for line in text.splitlines()
            if line.strip()
        ]

        print("\nPOSSIBLE TITLE:")
        print(lines[0] if lines else "[No text extracted]")

        print("\nPOSSIBLE DATE:")
        date_match = re.search(
            r"\b(?:DATE OF JUDGMENT:\s*)?"
            r"(\d{1,2}[/-]\d{1,2}[/-]\d{4}"
            r"|\d{1,2}\s+[A-Za-z]+\s*,?\s+\d{4})\b",
            text,
            re.IGNORECASE,
        )
        print(date_match.group(1) if date_match else "[Not detected]")

        print("\nPOSSIBLE CITATION:")
        citation_lines = [
            line for line in lines
            if "citation" in line.lower()
            or re.search(r"\b\d{4}\s+(?:AIR|SCR)\b", line, re.I)
        ]
        print("\n".join(citation_lines[:3]) or "[Not detected]")

        print("\nTEXT PREVIEW:")
        print(text[:700] or "[No selectable text extracted]")

    except Exception as exc:
        print("ERROR READING PDF:", exc)


def main():
    if not DATASET_DIR.is_dir():
        print("Dataset folder not found:")
        print(DATASET_DIR)
        print(
            "\nUpdate DATASET_DIR to the actual extracted folder path."
        )
        return

    print("Dataset folder:", DATASET_DIR)
    print("Inspecting up to 5 PDF files. No database writes.")

    count = 0

    for pdf_path in DATASET_DIR.rglob("*"):
        if pdf_path.is_file() and pdf_path.suffix.lower() == ".pdf":
            extract_sample(pdf_path)
            count += 1

            if count >= 5:
                break

    print("\n" + "=" * 75)
    print("PDF files inspected:", count)
    print("Database was not modified.")


if __name__ == "__main__":
    main()
