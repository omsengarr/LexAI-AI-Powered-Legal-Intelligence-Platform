const API_BASE_URL = "http://127.0.0.1:8000";

// ========================================
// Backend Health Check
// ========================================

export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

// ========================================
// Upload Legal Document
// ========================================

export async function uploadDocument(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Document upload failed");
  }

  return response.json();
}

// ========================================
// Get All Documents
// ========================================

export async function getDocuments() {
  const response = await fetch(`${API_BASE_URL}/documents`);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
}

// ========================================
// Get Document Count
// ========================================

export async function getDocumentCount() {
  const response = await fetch(`${API_BASE_URL}/documents/count`);

  if (!response.ok) {
    throw new Error("Failed to get document count");
  }

  return response.json();
}