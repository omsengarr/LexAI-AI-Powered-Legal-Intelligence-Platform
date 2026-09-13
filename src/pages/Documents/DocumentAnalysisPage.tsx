import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  getDocuments,
  getDocumentText,
  analyzeDocumentPages,
  summarizeDocument,
} from "../../services/api";

type DocumentItem = {
  id: number;
  filename: string;
  created_at?: string;
};

type PageItem = {
  page_number: number;
  text: string;
};

type AnalysisResult = {
  success?: boolean;
  message?: string;
  document_id?: number;
  filename?: string;
  total_pages?: number;
  locked_pages?: number[];
  analyzed_pages?: number[];
  analyzed_page_count?: number;
  analysis?: string;
};

type SummaryResult = {
  success?: boolean;
  message?: string;
  document_id?: number;
  filename?: string;
  total_pages?: number;
  locked_pages?: number[];
  summarized_pages?: number[];
  summarized_page_count?: number;
  summary?: string;
};

export default function DocumentAnalysisPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | null>(null);

  const [pages, setPages] = useState<PageItem[]>([]);
  const [lockedPages, setLockedPages] = useState<number[]>([]);

  const [loadingDocuments, setLoadingDocuments] =
    useState(true);

  const [loadingPages, setLoadingPages] =
    useState(false);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [summarizing, setSummarizing] =
    useState(false);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [summaryResult, setSummaryResult] =
    useState<SummaryResult | null>(null);

  const [error, setError] = useState("");

  const [analysisError, setAnalysisError] =
    useState("");

  const [summaryError, setSummaryError] =
    useState("");

  /*
   * Load all uploaded documents.
   */
  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoadingDocuments(true);
      setError("");

      const data = await getDocuments();

      /*
       * The backend returns either:
       *
       * [
       *   { id, filename, ... }
       * ]
       *
       * or:
       *
       * { documents: [...] }
       *
       * Handle both formats safely.
       */
      const documentList = Array.isArray(data)
        ? data
        : data.documents || [];

      setDocuments(documentList);

      if (
        documentList.length > 0 &&
        selectedDocumentId === null
      ) {
        setSelectedDocumentId(documentList[0].id);
      }
    } catch (err) {
      console.error(
        "Failed to load documents:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load documents."
      );
    } finally {
      setLoadingDocuments(false);
    }
  }

  /*
   * Load pages whenever the selected document changes.
   */
  useEffect(() => {
    if (selectedDocumentId === null) {
      setPages([]);
      setLockedPages([]);
      setAnalysisResult(null);
      setSummaryResult(null);
      return;
    }

    loadPages(selectedDocumentId);
  }, [selectedDocumentId]);

  async function loadPages(documentId: number) {
    try {
      setLoadingPages(true);
      setError("");

      setPages([]);
      setLockedPages([]);

      setAnalysisResult(null);
      setSummaryResult(null);

      setAnalysisError("");
      setSummaryError("");

      /*
       * Initially load the document without
       * locked pages so that the UI can display
       * every page.
       */
      const data = await getDocumentText(documentId);

      setPages(data.pages || []);
    } catch (err) {
      console.error(
        "Failed to load document pages:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load document pages."
      );
    } finally {
      setLoadingPages(false);
    }
  }

  /*
   * Lock or unlock an individual page.
   */
  function togglePageLock(pageNumber: number) {
    setLockedPages((currentLockedPages) => {
      if (
        currentLockedPages.includes(pageNumber)
      ) {
        return currentLockedPages.filter(
          (page) => page !== pageNumber
        );
      }

      return [
        ...currentLockedPages,
        pageNumber,
      ].sort((a, b) => a - b);
    });

    /*
     * Existing AI results become stale whenever
     * the privacy configuration changes.
     */
    setAnalysisResult(null);
    setSummaryResult(null);

    setAnalysisError("");
    setSummaryError("");
  }

  /*
   * Analyze only unlocked pages.
   */
  async function handleAnalyzeUnlockedPages() {
    if (selectedDocumentId === null) {
      return;
    }

    if (pages.length === 0) {
      setAnalysisError(
        "There are no pages available to analyze."
      );
      return;
    }

    if (
      lockedPages.length === pages.length
    ) {
      setAnalysisError(
        "All pages are locked. Unlock at least one page before analyzing."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisError("");
      setAnalysisResult(null);

      const result =
        await analyzeDocumentPages(
          selectedDocumentId,
          lockedPages
        );

      setAnalysisResult(result);
    } catch (err) {
      console.error(
        "Document analysis failed:",
        err
      );

      setAnalysisError(
        err instanceof Error
          ? err.message
          : "Failed to analyze document."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  /*
   * Generate one complete summary for the
   * selected document using only unlocked pages.
   */
  async function handleSummarizeDocument() {
    if (selectedDocumentId === null) {
      return;
    }

    if (pages.length === 0) {
      setSummaryError(
        "There are no pages available to summarize."
      );
      return;
    }

    if (
      lockedPages.length === pages.length
    ) {
      setSummaryError(
        "All pages are locked. Unlock at least one page before generating a summary."
      );
      return;
    }

    try {
      setSummarizing(true);
      setSummaryError("");
      setSummaryResult(null);

      const result =
        await summarizeDocument(
          selectedDocumentId,
          lockedPages
        );

      setSummaryResult(result);
    } catch (err) {
      console.error(
        "Document summary failed:",
        err
      );

      setSummaryError(
        err instanceof Error
          ? err.message
          : "Failed to generate document summary."
      );
    } finally {
      setSummarizing(false);
    }
  }

  const selectedDocument =
    documents.find(
      (document) =>
        document.id === selectedDocumentId
    );

  const unlockedPageCount =
    pages.length - lockedPages.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* PAGE HEADER */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Page Lock & Analysis
          </h1>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Lock private pages before sending document
            content to LexAI for AI analysis.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}

        {/* DOCUMENT SELECTOR */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "22px",
            marginBottom: "24px",
            boxShadow:
              "0 1px 3px rgba(15, 23, 42, 0.06)",
          }}
        >
          <label
            htmlFor="document-select"
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              color: "#334155",
              marginBottom: "8px",
            }}
          >
            Select Document
          </label>

          {loadingDocuments ? (
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div
              style={{
                padding: "16px",
                borderRadius: "10px",
                background: "#f8fafc",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              No documents have been uploaded yet.
            </div>
          ) : (
            <select
              id="document-select"
              value={
                selectedDocumentId ?? ""
              }
              onChange={(event) =>
                setSelectedDocumentId(
                  Number(event.target.value)
                )
              }
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              {documents.map((document) => (
                <option
                  key={document.id}
                  value={document.id}
                >
                  {document.filename}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* SELECTED DOCUMENT */}

        {selectedDocument && (
          <>
            {/* DOCUMENT HEADER */}

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "22px",
                marginBottom: "24px",
                boxShadow:
                  "0 1px 3px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "#0f172a",
                      fontSize: "22px",
                      fontWeight: 700,
                    }}
                  >
                    {selectedDocument.filename}
                  </h2>

                  <div
                    style={{
                      display: "flex",
                      gap: "18px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                      fontSize: "14px",
                      color: "#64748b",
                    }}
                  >
                    <span>
                      {pages.length}{" "}
                      {pages.length === 1
                        ? "page"
                        : "pages"}
                    </span>

                    <span>
                      {unlockedPageCount} unlocked
                    </span>

                    <span>
                      {lockedPages.length} locked
                    </span>
                  </div>
                </div>

                {/* DOCUMENT-LEVEL ACTIONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={
                      handleSummarizeDocument
                    }
                    disabled={
                      summarizing ||
                      analyzing ||
                      loadingPages ||
                      pages.length === 0 ||
                      lockedPages.length ===
                        pages.length
                    }
                    style={{
                      border: "none",
                      borderRadius: "9px",
                      padding:
                        "11px 16px",
                      background:
                        summarizing ||
                        analyzing ||
                        loadingPages ||
                        pages.length === 0 ||
                        lockedPages.length ===
                          pages.length
                          ? "#94a3b8"
                          : "#0f766e",
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor:
                        summarizing ||
                        analyzing ||
                        loadingPages ||
                        pages.length === 0 ||
                        lockedPages.length ===
                          pages.length
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {summarizing
                      ? "Summarizing..."
                      : "Summarize Document"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleAnalyzeUnlockedPages
                    }
                    disabled={
                      analyzing ||
                      summarizing ||
                      loadingPages ||
                      pages.length === 0 ||
                      lockedPages.length ===
                        pages.length
                    }
                    style={{
                      border: "none",
                      borderRadius: "9px",
                      padding:
                        "11px 16px",
                      background:
                        analyzing ||
                        summarizing ||
                        loadingPages ||
                        pages.length === 0 ||
                        lockedPages.length ===
                          pages.length
                          ? "#94a3b8"
                          : "#2563eb",
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor:
                        analyzing ||
                        summarizing ||
                        loadingPages ||
                        pages.length === 0 ||
                        lockedPages.length ===
                          pages.length
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {analyzing
                      ? "Analyzing..."
                      : "Analyze Unlocked Pages"}
                  </button>
                </div>
              </div>

              {/* PRIVACY STATUS */}

              <div
                style={{
                  marginTop: "18px",
                  padding: "13px 15px",
                  borderRadius: "10px",
                  background:
                    lockedPages.length > 0
                      ? "#fff7ed"
                      : "#f0fdf4",
                  border:
                    lockedPages.length > 0
                      ? "1px solid #fed7aa"
                      : "1px solid #bbf7d0",
                  color:
                    lockedPages.length > 0
                      ? "#9a3412"
                      : "#166534",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {lockedPages.length > 0 ? (
                  <>
                    <strong>
                      Privacy protection active:
                    </strong>{" "}
                    {lockedPages.length}{" "}
                    {lockedPages.length === 1
                      ? "page is"
                      : "pages are"}{" "}
                    locked and will be excluded
                    from AI analysis and document
                    summarization.
                  </>
                ) : (
                  <>
                    <strong>
                      No pages are locked.
                    </strong>{" "}
                    All pages are currently available
                    for AI analysis and summarization.
                  </>
                )}
              </div>
            </div>

            {/* PAGE LIST */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {loadingPages ? (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "28px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  Loading document pages...
                </div>
              ) : pages.length === 0 ? (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "28px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No readable pages were found in
                  this document.
                </div>
              ) : (
                pages.map((page) => {
                  const isLocked =
                    lockedPages.includes(
                      page.page_number
                    );

                  return (
                    <div
                      key={page.page_number}
                      style={{
                        background: "#ffffff",
                        border: isLocked
                          ? "1px solid #fecaca"
                          : "1px solid #e2e8f0",
                        borderRadius: "14px",
                        overflow: "hidden",
                        boxShadow:
                          "0 1px 3px rgba(15, 23, 42, 0.05)",
                      }}
                    >
                      {/* PAGE HEADER */}

                      <div
                        style={{
                          padding:
                            "16px 18px",
                          borderBottom:
                            "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "18px",
                            }}
                          >
                            {isLocked
                              ? "🔒"
                              : "🔓"}
                          </span>

                          <h3
                            style={{
                              margin: 0,
                              fontSize: "17px",
                              fontWeight: 700,
                              color:
                                "#0f172a",
                            }}
                          >
                            Page{" "}
                            {page.page_number}
                          </h3>

                          {isLocked && (
                            <span
                              style={{
                                fontSize:
                                  "12px",
                                fontWeight:
                                  600,
                                color:
                                  "#991b1b",
                                background:
                                  "#fee2e2",
                                padding:
                                  "4px 8px",
                                borderRadius:
                                  "999px",
                              }}
                            >
                              Private
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            togglePageLock(
                              page.page_number
                            )
                          }
                          style={{
                            border: "none",
                            borderRadius:
                              "8px",
                            padding:
                              "9px 13px",
                            background:
                              isLocked
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              isLocked
                                ? "#166534"
                                : "#991b1b",
                            fontWeight: 600,
                            fontSize:
                              "13px",
                            cursor:
                              "pointer",
                          }}
                        >
                          {isLocked
                            ? "Unlock Page"
                            : "Lock Page"}
                        </button>
                      </div>

                      {/* PAGE CONTENT */}

                      {isLocked ? (
                        <div
                          style={{
                            padding:
                              "30px 20px",
                            textAlign:
                              "center",
                            background:
                              "#fef2f2",
                            color:
                              "#991b1b",
                          }}
                        >
                          <div
                            style={{
                              fontSize:
                                "28px",
                              marginBottom:
                                "8px",
                            }}
                          >
                            🔒
                          </div>

                          <div
                            style={{
                              fontWeight:
                                700,
                              marginBottom:
                                "4px",
                            }}
                          >
                            Private page
                          </div>

                          <div
                            style={{
                              fontSize:
                                "13px",
                              color:
                                "#b91c1c",
                            }}
                          >
                            Excluded from AI
                            analysis and
                            summarization
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            padding:
                              "20px",
                          }}
                        >
                          <div
                            style={{
                              whiteSpace:
                                "pre-wrap",
                              lineHeight:
                                1.7,
                              fontSize:
                                "14px",
                              color:
                                "#334155",
                              maxHeight:
                                "420px",
                              overflowY:
                                "auto",
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius:
                                "10px",
                              padding:
                                "16px",
                              boxSizing:
                                "border-box",
                            }}
                          >
                            {page.text?.trim()
                              ? page.text
                              : "No readable text was extracted from this page."}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* SUMMARY ERROR */}

            {summaryError && (
              <div
                style={{
                  marginTop: "24px",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "#fee2e2",
                  border:
                    "1px solid #fecaca",
                  color: "#991b1b",
                }}
              >
                <strong>
                  Summary error:
                </strong>{" "}
                {summaryError}
              </div>
            )}

            {/* DOCUMENT SUMMARY */}

            {summaryResult?.summary && (
              <div
                style={{
                  marginTop: "24px",
                  background: "#ffffff",
                  border:
                    "1px solid #99f6e4",
                  borderRadius: "14px",
                  padding: "24px",
                  boxShadow:
                    "0 1px 3px rgba(15, 23, 42, 0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom:
                      "18px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: 700,
                        color:
                          "#134e4a",
                      }}
                    >
                      AI Document Summary
                    </h2>

                    <p
                      style={{
                        marginTop:
                          "7px",
                        marginBottom: 0,
                        color:
                          "#64748b",
                        fontSize:
                          "13px",
                      }}
                    >
                      Generated using only
                      unlocked pages.
                    </p>
                  </div>

                  {summaryResult.summarized_page_count !==
                    undefined && (
                    <div
                      style={{
                        padding:
                          "8px 12px",
                        borderRadius:
                          "999px",
                        background:
                          "#ccfbf1",
                        color:
                          "#115e59",
                        fontSize:
                          "12px",
                        fontWeight:
                          600,
                      }}
                    >
                      {
                        summaryResult.summarized_page_count
                      }{" "}
                      pages analyzed
                    </div>
                  )}
                </div>

                {/* PRIVACY CONFIRMATION */}

                <div
                  style={{
                    marginBottom:
                      "18px",
                    padding:
                      "12px 14px",
                    borderRadius:
                      "9px",
                    background:
                      "#f0fdfa",
                    border:
                      "1px solid #ccfbf1",
                    color:
                      "#115e59",
                    fontSize:
                      "13px",
                  }}
                >
                  🔐 Locked pages were excluded
                  from this summary.
                  {summaryResult.locked_pages &&
                    summaryResult.locked_pages
                      .length > 0 && (
                      <>
                        {" "}
                        Locked pages:{" "}
                        {summaryResult.locked_pages.join(
                          ", "
                        )}
                        .
                      </>
                    )}
                </div>

                {/* MARKDOWN SUMMARY */}

                <div
                  style={{
                    color: "#334155",
                    fontSize: "15px",
                    lineHeight: 1.75,
                  }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({
                        children,
                      }) => (
                        <h1
                          style={{
                            color:
                              "#0f172a",
                            fontSize:
                              "25px",
                            marginTop:
                              "10px",
                            marginBottom:
                              "14px",
                          }}
                        >
                          {children}
                        </h1>
                      ),

                      h2: ({
                        children,
                      }) => (
                        <h2
                          style={{
                            color:
                              "#134e4a",
                            fontSize:
                              "20px",
                            marginTop:
                              "24px",
                            marginBottom:
                              "10px",
                          }}
                        >
                          {children}
                        </h2>
                      ),

                      h3: ({
                        children,
                      }) => (
                        <h3
                          style={{
                            color:
                              "#334155",
                            fontSize:
                              "17px",
                            marginTop:
                              "18px",
                            marginBottom:
                              "8px",
                          }}
                        >
                          {children}
                        </h3>
                      ),

                      p: ({
                        children,
                      }) => (
                        <p
                          style={{
                            marginTop:
                              "8px",
                            marginBottom:
                              "12px",
                          }}
                        >
                          {children}
                        </p>
                      ),

                      ul: ({
                        children,
                      }) => (
                        <ul
                          style={{
                            paddingLeft:
                              "24px",
                            marginTop:
                              "8px",
                            marginBottom:
                              "14px",
                          }}
                        >
                          {children}
                        </ul>
                      ),

                      ol: ({
                        children,
                      }) => (
                        <ol
                          style={{
                            paddingLeft:
                              "24px",
                            marginTop:
                              "8px",
                            marginBottom:
                              "14px",
                          }}
                        >
                          {children}
                        </ol>
                      ),

                      li: ({
                        children,
                      }) => (
                        <li
                          style={{
                            marginBottom:
                              "7px",
                          }}
                        >
                          {children}
                        </li>
                      ),

                      strong: ({
                        children,
                      }) => (
                        <strong
                          style={{
                            color:
                              "#0f172a",
                          }}
                        >
                          {children}
                        </strong>
                      ),

                      blockquote: ({
                        children,
                      }) => (
                        <blockquote
                          style={{
                            margin:
                              "16px 0",
                            padding:
                              "10px 16px",
                            borderLeft:
                              "4px solid #14b8a6",
                            background:
                              "#f0fdfa",
                            color:
                              "#475569",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {summaryResult.summary}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* ANALYSIS ERROR */}

            {analysisError && (
              <div
                style={{
                  marginTop: "24px",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "#fee2e2",
                  border:
                    "1px solid #fecaca",
                  color: "#991b1b",
                }}
              >
                <strong>
                  Analysis error:
                </strong>{" "}
                {analysisError}
              </div>
            )}

            {/* ANALYSIS RESULT */}

            {analysisResult?.analysis && (
              <div
                style={{
                  marginTop: "24px",
                  background: "#ffffff",
                  border:
                    "1px solid #bfdbfe",
                  borderRadius: "14px",
                  padding: "24px",
                  boxShadow:
                    "0 1px 3px rgba(15, 23, 42, 0.06)",
                }}
              >
                <div
                  style={{
                    marginBottom:
                      "18px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: 700,
                      color:
                        "#1e3a8a",
                    }}
                  >
                    AI Analysis
                  </h2>

                  <p
                    style={{
                      marginTop:
                        "7px",
                      marginBottom: 0,
                      color:
                        "#64748b",
                      fontSize:
                        "13px",
                    }}
                  >
                    Analysis generated using
                    only unlocked pages.
                  </p>
                </div>

                <div
                  style={{
                    marginBottom:
                      "18px",
                    padding:
                      "12px 14px",
                    borderRadius:
                      "9px",
                    background:
                      "#eff6ff",
                    border:
                      "1px solid #dbeafe",
                    color:
                      "#1e40af",
                    fontSize:
                      "13px",
                  }}
                >
                  🔐 Locked pages were excluded
                  from this analysis.
                  {analysisResult.locked_pages &&
                    analysisResult.locked_pages
                      .length > 0 && (
                      <>
                        {" "}
                        Locked pages:{" "}
                        {analysisResult.locked_pages.join(
                          ", "
                        )}
                        .
                      </>
                    )}
                </div>

                <div
                  style={{
                    color:
                      "#334155",
                    fontSize:
                      "15px",
                    lineHeight:
                      1.75,
                  }}
                >
                  <ReactMarkdown>
                    {analysisResult.analysis}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}