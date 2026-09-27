from document_manager import upload_document


print("Testing validated PDF upload...")

result = upload_document("sample_legal_document.pdf")

print("\nUpload successful!")

print("\nDocument information:")
print("---------------------")

metadata = result["metadata"]

for key, value in metadata.items():
    print(f"{key}: {value}")