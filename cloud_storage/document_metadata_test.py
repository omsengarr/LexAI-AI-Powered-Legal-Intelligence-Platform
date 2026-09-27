from document_metadata import create_document_metadata


metadata = create_document_metadata(
    "sample_contract.txt",
    "documents/test-document-path.txt"
)

print("Document metadata created successfully!")
print(metadata)