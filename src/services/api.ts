const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8001";

export { API_BASE_URL };

// ========================================
// Health Check
// ========================================

export async function healthCheck() {
  const response = await fetch(
    `${API_BASE_URL}/health`
  );

  if (!response.ok) {
    throw new Error(
      "Backend health check failed."
    );
  }

  return response.json();
}

// ========================================
// Document Count
// ========================================

export async function getDocumentCount() {
  const response = await fetch(
    `${API_BASE_URL}/documents/count`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to get document count."
    );
  }

  return response.json();
}

// ========================================
// AI Query Count
// ========================================

export async function getAIQueryCount() {
  const response = await fetch(
    `${API_BASE_URL}/queries/count`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to get AI query count."
    );
  }

  return response.json();
}

// ========================================
// Upload Document
// ========================================

export async function uploadDocument(
  file: File
) {
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
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Failed to upload document."
    );
  }

  return response.json();
}

// ========================================
// Get Documents
// ========================================

export async function getDocuments() {
  const response = await fetch(
    `${API_BASE_URL}/documents`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to get documents."
    );
  }

  return response.json();
}

// ========================================
// Delete Document
// ========================================

export async function deleteDocument(
  documentId: number
) {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Failed to delete document."
    );
  }

  return response.json();
}

// ========================================
// Save AI Query
// ========================================

export async function saveAIQuery(
  query: string
) {
  const response = await fetch(
    `${API_BASE_URL}/queries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Failed to save AI query."
    );
  }

  return response.json();
}

// ========================================
// Get Document Text
//
// lockedPages are never returned by backend.
// ========================================

export async function getDocumentText(
  documentId: number,
  lockedPages: number[] = []
) {
  const query =
    lockedPages.length > 0
      ? `?locked_pages=${lockedPages.join(",")}`
      : "";

  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}/text${query}`
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Failed to extract document text."
    );
  }

  return response.json();
}

// ========================================
// Analyze Selected Document Pages
// ========================================

export async function analyzeDocumentPages(
  documentId: number,
  lockedPages: number[]
) {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}/analyze-pages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locked_pages: lockedPages,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Failed to analyze document pages."
    );
  }

  return response.json();
}

// ========================================
// Whole Document Summary
// ========================================

export async function summarizeDocument(
  documentId: number,
  lockedPages: number[]
) {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}/summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locked_pages: lockedPages,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Failed to generate document summary."
    );
  }

  return response.json();
}

// ========================================
// AI RISK ANALYSIS
// ========================================

export async function analyzeDocumentRisk(
  documentId: number,
  lockedPages: number[]
) {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}/risk-analysis`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locked_pages: lockedPages,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Failed to generate AI risk analysis."
    );
  }

  return response.json();
}

// ========================================
// AI Chat
//
// DO NOT MODIFY
// ========================================

export async function sendChatMessage(
  message: string
) {
  const response = await fetch(
    `${API_BASE_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Failed to send chat message."
    );
  }

  return response.json();
}


// ========================================
// Login
// ========================================

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_BASE_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Login failed."
    );
  }

  return data;
}

export async function analyzeDocumentCompliance(
  documentId: number,
  regulation: string,
  lockedPages: number[] = []
) {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}/compliance`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        regulation,
        locked_pages: lockedPages,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to analyze document compliance."
    );
  }

  return data;
}

// ========================================
// AI CASE COMPARISON
// ========================================

export async function compareCases(
  case1Id: number,
  case2Id: number
) {
  const response = await fetch(
    `${API_BASE_URL}/cases/compare`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        case1_id: case1Id,
        case2_id: case2Id,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Failed to compare the selected cases."
    );
  }

  return data;
}
