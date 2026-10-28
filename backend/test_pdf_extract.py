
from pathlib import Path
from pypdf import PdfReader

# Change this if your extracted folder has a different location.
DATASET_DIR = Path(
    r"C:\Users\omsen\Downloads\archive\supreme_court_judgments"
)

def main():
    if not DATASET_DIR.is_dir():
        print("ERROR: Dataset folder was not found:")
        print(DATASET_DIR)
        print("\nCheck the extraction location and update DATASET_DIR.")
        return

    print("Searching for one PDF...")
    pdf_files = DATASET_DIR.rglob("*.pdf")
    pdf_path = next(pdf_files, None)

    if pdf_path is None:
        print("No PDF files found in the dataset folder.")
        return

    print(f"\nTest file: {pdf_path.name}")

    try:
        reader = PdfReader(str(pdf_path))

        print(f"Pages: {len(reader.pages)}")

        # Read only the first two pages for this test.
        text_parts = []
        for page in reader.pages[:2]:
            text_parts.append(page.extract_text() or "")

        extracted_text = "\n".join(text_parts).strip()

        print("\n--- EXTRACTED TEXT PREVIEW ---")
        print(extracted_text[:2500] or "[No selectable text extracted]")
        print("\n--- END PREVIEW ---")

        if len(extracted_text) > 100:
            print("\nSUCCESS: PDF text extraction appears to work.")
        else:
            print(
                "\nWARNING: Very little text was extracted. "
                "We may need to inspect this PDF or use OCR."
            )

    except Exception as exc:
        print(f"\nPDF extraction failed: {exc}")

if __name__ == "__main__":
    main()
