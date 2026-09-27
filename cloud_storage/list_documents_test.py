from document_manager import list_documents


print("Documents currently stored in Supabase:")
print("----------------------------------------")

documents = list_documents()

if not documents:
    print("No documents found.")

else:
    for document in documents:
        print(
            f"Name: {document.get('name')}"
        )
        print(
            f"Size: {document.get('metadata', {}).get('size', 'N/A')}"
        )
        print(
            f"Type: {document.get('metadata', {}).get('mimetype', 'N/A')}"
        )
        print("----------------------------------------")