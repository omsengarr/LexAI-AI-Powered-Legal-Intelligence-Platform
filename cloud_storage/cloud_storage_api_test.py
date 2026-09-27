from cloud_storage_api import (
    upload,
    download,
    delete,
    list_all
)


print("====================================")
print("   LEXAI CLOUD STORAGE API TEST")
print("====================================")


# 1. Upload
print("\n1. Uploading PDF...")

result = upload("sample_legal_document.pdf")

metadata = result["metadata"]
storage_path = metadata["storage_path"]

print("Upload successful!")
print("Original filename:", metadata["original_filename"])
print("Storage path:", storage_path)
print("Content type:", metadata["content_type"])
print("File size:", metadata["file_size"])


# 2. Download
print("\n2. Downloading PDF...")

download(
    storage_path,
    "api_downloaded_document.pdf"
)

print("Download successful!")


# 3. List
print("\n3. Listing documents...")

documents = list_all()

print("Documents found:", len(documents))

for document in documents:
    print("-", document.get("name"))


# 4. Delete
print("\n4. Deleting uploaded test document...")

delete(storage_path)

print("Delete successful!")


print("\n====================================")
print("   CLOUD STORAGE API TEST PASSED")
print("====================================")