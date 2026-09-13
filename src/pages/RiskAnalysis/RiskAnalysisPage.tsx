import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import RiskScoreCard from "../../components/risk/RiskScoreCard";
import ClauseCard from "../../components/risk/ClauseCard";
import RecommendationCard from "../../components/risk/RecommendationCard";

import {
  getDocuments,
  getDocumentText,
  analyzeDocumentRisk,
} from "../../services/api";

interface DocumentItem {
  id: number;
  filename: string;
  content_type?: string;
  uploaded_at?: string;
}

interface PageItem {
  page_number: number;
  text: string;
}

interface RiskItem {
  title: string;
  severity: "Low" | "Medium" | "High";
  page: number;
  description: string;
  recommendation: string;
}

interface RiskAnalysisResult {
  success: boolean;
  message: string;
  document_id: number;
  filename: string;
  total_pages: number;
  locked_pages: number[];
  analyzed_pages: number[];
  analyzed_page_count: number;
  overall_score: number;
  risk_level: "Low" | "Medium" | "High";
  summary: string;
  risks: RiskItem[];
  recommendations: string[];
}

function RiskAnalysisPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | null>(null);

  const [pages, setPages] = useState<PageItem[]>([]);
  const [lockedPages, setLockedPages] = useState<number[]>([]);

  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [loadingPages, setLoadingPages] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] =
    useState<RiskAnalysisResult | null>(null);

  // ========================================
  // Load Documents
  // ========================================

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoadingDocuments(true);
        setError("");

        const data = await getDocuments();

        const documentList: DocumentItem[] = Array.isArray(data)
          ? data
          : data.documents || [];

        setDocuments(documentList);

        if (documentList.length > 0) {
          setSelectedDocumentId(documentList[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load documents."
        );
      } finally {
        setLoadingDocuments(false);
      }
    }

    loadDocuments();
  }, []);

  // ========================================
  // Load Pages
  // ========================================

  useEffect(() => {
    if (selectedDocumentId === null) {
      return;
    }

    const documentId = selectedDocumentId;

    async function loadPages() {
      try {
        setLoadingPages(true);
        setError("");
        setResult(null);
        setLockedPages([]);

        /*
         * documentId is guaranteed to be a number here
         * because the null check above has already passed.
         */
        const data = await getDocumentText(documentId);

        const documentPages: PageItem[] = Array.isArray(data.pages)
          ? data.pages
          : [];

        setPages(documentPages);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load document pages."
        );

        setPages([]);
      } finally {
        setLoadingPages(false);
      }
    }

    loadPages();
  }, [selectedDocumentId]);

  // ========================================
  // Toggle Page Lock
  // ========================================

  function togglePageLock(pageNumber: number) {
    setLockedPages((current) => {
      if (current.includes(pageNumber)) {
        return current.filter(
          (page) => page !== pageNumber
        );
      }

      return [...current, pageNumber].sort(
        (a, b) => a - b
      );
    });

    setResult(null);
    setError("");
  }

  // ========================================
  // Run AI Risk Analysis
  // ========================================

  async function handleRiskAnalysis() {
    if (selectedDocumentId === null) {
      setError("Please select a document first.");
      return;
    }

    if (pages.length === 0) {
      setError(
        "No readable pages are available for analysis."
      );
      return;
    }

    if (lockedPages.length === pages.length) {
      setError(
        "All pages are locked. Unlock at least one page before running risk analysis."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setResult(null);

      const data = await analyzeDocumentRisk(
        selectedDocumentId,
        lockedPages
      );

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate AI risk analysis."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  // ========================================
  // Selected Document
  // ========================================

  const selectedDocument = documents.find(
    (document) =>
      document.id === selectedDocumentId
  );

  // ========================================
  // Loading Documents
  // ========================================

  if (loadingDocuments) {
    return (
      <main className="p-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-400">
            Loading documents...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // Main Page
  // ========================================

  return (
    <main className="p-8 space-y-8">

      {/* ================================== */}
      {/* Header */}
      {/* ================================== */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          AI Risk Analysis
        </h1>

        <p className="text-slate-400 mt-2">
          Analyze your legal documents and
          identify potential contractual,
          legal, compliance and operational
          risks.
        </p>
      </div>

      {/* ================================== */}
      {/* Document Selection */}
      {/* ================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-white mb-4">
          Select Document
        </h2>

        {documents.length === 0 ? (
          <div className="text-slate-400">
            No documents have been uploaded yet.
          </div>
        ) : (
          <select
            value={selectedDocumentId ?? ""}
            onChange={(event) => {
              const value = Number(
                event.target.value
              );

              setSelectedDocumentId(
                Number.isNaN(value) ? null : value
              );
            }}
            className="
              w-full
              bg-slate-800
              border
              border-slate-700
              text-white
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-cyan-500
            "
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

        {selectedDocument && (
          <div className="mt-4 text-sm text-slate-400">
            Selected:{" "}
            <span className="text-white font-medium">
              {selectedDocument.filename}
            </span>
          </div>
        )}
      </div>

      {/* ================================== */}
      {/* Privacy / Page Locks */}
      {/* ================================== */}

      {selectedDocumentId !== null && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

            <div>
              <h2 className="text-xl font-bold text-white">
                Protect Pages
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Locked pages will not be sent
                to Gemini for risk analysis.
              </p>
            </div>

            <div className="text-sm text-slate-400">
              {lockedPages.length} locked /{" "}
              {pages.length} pages
            </div>

          </div>

          {loadingPages ? (
            <p className="text-slate-400">
              Loading document pages...
            </p>
          ) : pages.length === 0 ? (
            <p className="text-slate-400">
              No readable pages found.
            </p>
          ) : (
            <div className="space-y-3">

              {pages.map((page) => {
                const isLocked =
                  lockedPages.includes(
                    page.page_number
                  );

                return (
                  <div
                    key={page.page_number}
                    className={`
                      border
                      rounded-xl
                      p-4
                      transition
                      ${
                        isLocked
                          ? "border-red-500/40 bg-red-500/10"
                          : "border-slate-800 bg-slate-950"
                      }
                    `}
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div
                          className={`
                            w-10
                            h-10
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            font-bold
                            ${
                              isLocked
                                ? "bg-red-500/20 text-red-400"
                                : "bg-green-500/20 text-green-400"
                            }
                          `}
                        >
                          {page.page_number}
                        </div>

                        <div>
                          <p className="text-white font-semibold">
                            Page{" "}
                            {page.page_number}
                          </p>

                          <p className="text-xs text-slate-400">
                            {isLocked
                              ? "Protected from AI analysis"
                              : "Available for AI analysis"}
                          </p>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          togglePageLock(
                            page.page_number
                          )
                        }
                        className={`
                          px-4
                          py-2
                          rounded-lg
                          font-medium
                          transition
                          ${
                            isLocked
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }
                        `}
                      >
                        {isLocked
                          ? "Unlock"
                          : "Lock Page"}
                      </button>

                    </div>

                    {!isLocked && (
                      <div className="mt-4 text-sm text-slate-400 bg-slate-900 rounded-lg p-3 max-h-28 overflow-y-auto">
                        {page.text?.trim() ||
                          "No readable text on this page."}
                      </div>
                    )}

                    {isLocked && (
                      <div className="mt-4 text-sm text-red-300 bg-red-500/10 rounded-lg p-3">
                        🔒 Private page — excluded
                        from AI risk analysis.
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

          {/* ================================== */}
          {/* Analyze Button */}
          {/* ================================== */}

          <div className="mt-6">

            <button
              type="button"
              onClick={handleRiskAnalysis}
              disabled={
                analyzing ||
                loadingPages ||
                pages.length === 0 ||
                lockedPages.length === pages.length
              }
              className="
                w-full
                bg-cyan-500
                hover:bg-cyan-400
                disabled:bg-slate-700
                disabled:text-slate-500
                text-white
                font-bold
                py-4
                rounded-xl
                transition
                shadow-lg
              "
            >
              {analyzing
                ? "Analyzing Document with AI..."
                : "Run AI Risk Analysis"}
            </button>

          </div>

        </div>
      )}

      {/* ================================== */}
      {/* Error */}
      {/* ================================== */}

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-300 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* ================================== */}
      {/* Risk Results */}
      {/* ================================== */}

      {result && (
        <div className="space-y-8">

          {/* ================================= */}
          {/* Result Header */}
          {/* ================================= */}

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">

            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wide">
              AI Analysis Complete
            </p>

            <h2 className="text-2xl font-bold text-white mt-2">
              {result.filename}
            </h2>

            <p className="text-slate-400 mt-2">
              AI analyzed{" "}
              {result.analyzed_page_count}{" "}
              unlocked page
              {result.analyzed_page_count !== 1
                ? "s"
                : ""}.

              {result.locked_pages.length > 0 && (
                <>
                  {" "}
                  {result.locked_pages.length}{" "}
                  page
                  {result.locked_pages.length !== 1
                    ? "s"
                    : ""}{" "}
                  were protected.
                </>
              )}
            </p>

          </div>

          {/* ================================= */}
          {/* Score */}
          {/* ================================= */}

          <RiskScoreCard
            score={result.overall_score}
          />

          {/* ================================= */}
          {/* Risk Level */}
          {/* ================================= */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">

            <p className="text-slate-400 text-sm uppercase tracking-wide">
              Overall Risk Level
            </p>

            <div
              className={`
                inline-block
                mt-3
                px-6
                py-3
                rounded-full
                font-bold
                text-lg
                ${
                  result.risk_level === "High"
                    ? "bg-red-500/20 text-red-400"
                    : result.risk_level === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }
              `}
            >
              {result.risk_level} Risk
            </div>

          </div>

          {/* ================================= */}
          {/* Summary */}
          {/* ================================= */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold text-white mb-4">
              AI Risk Summary
            </h2>

            <div className="text-slate-300 leading-7">
              <ReactMarkdown>
                {result.summary}
              </ReactMarkdown>
            </div>

          </div>

          {/* ================================= */}
          {/* Identified Risks */}
          {/* ================================= */}

          <div className="space-y-4">

            <h2 className="text-xl font-bold text-white">
              Identified Risks
            </h2>

            {result.risks.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-green-300">
                No significant risks were
                identified in the unlocked
                document content.
              </div>
            ) : (
              result.risks.map((risk, index) => (
                <div
                  key={index}
                  className="space-y-3"
                >

                  <ClauseCard
                    clause={`${risk.title} — Page ${risk.page}`}
                    risk={risk.severity}
                  />

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                    <p className="text-slate-300 leading-7">
                      {risk.description}
                    </p>

                    {risk.recommendation && (
                      <div className="mt-4 pt-4 border-t border-slate-800">

                        <p className="text-cyan-400 font-semibold mb-1">
                          Recommendation
                        </p>

                        <p className="text-slate-400">
                          {risk.recommendation}
                        </p>

                      </div>
                    )}

                  </div>

                </div>
              ))
            )}

          </div>

          {/* ================================= */}
          {/* Recommendations */}
          {/* ================================= */}

          <div className="space-y-4">

            <h2 className="text-xl font-bold text-white">
              AI Recommendations
            </h2>

            {result.recommendations.length > 0 ? (
              result.recommendations.map(
                (recommendation, index) => (
                  <RecommendationCard
                    key={index}
                    recommendation={recommendation}
                  />
                )
              )
            ) : (
              <RecommendationCard
                recommendation="No additional recommendations were generated from the available document content."
              />
            )}

          </div>

        </div>
      )}

    </main>
  );
}

export default RiskAnalysisPage;