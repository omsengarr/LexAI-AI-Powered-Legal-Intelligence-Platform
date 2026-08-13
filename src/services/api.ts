const API_BASE_URL = "http://127.0.0.1:8000";

// ========================================
// Health Check
// ========================================

export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
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
  const response = await fetch(
    `${API_BASE_URL}/documents/count`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch document count");
  }

  return response.json();
}


// ========================================
// Delete Document
// ========================================

export async function deleteDocument(documentId: number) {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to delete document"
    );
  }

  return response.json();
}


// ========================================
// Get AI Query Count
// ========================================

export async function getAIQueryCount() {
  const response = await fetch(
    `${API_BASE_URL}/queries/count`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch AI query count");
  }

  return response.json();
}


// ========================================
// Save AI Query
// ========================================

export async function saveAIQuery(query: string) {
  const response = await fetch(
    `${API_BASE_URL}/queries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to save AI query"
    );
  }

  return response.json();
}


// ========================================
// Upload Document
// ========================================

export async function uploadDocument(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Failed to upload document"
    );
  }

  return response.json();
}