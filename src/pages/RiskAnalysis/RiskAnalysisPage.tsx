import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  LockKeyhole,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Unlock,
} from "lucide-react";

import RiskScoreCard from "../../components/risk/RiskScoreCard";
import ClauseCard from "../../components/risk/ClauseCard";
import RecommendationCard from "../../components/risk/RecommendationCard";

import {
  getDocuments,
  getDocumentText,
  analyzeDocumentRisk,
} from "../../services/api";

// ========================================
// Interfaces
// ========================================

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

// ========================================
// Risk Analysis Page
// ========================================

function RiskAnalysisPage() {
  // ========================================
  // State
  // ========================================

  const [documents, setDocuments] = useState<DocumentItem[]>(
    []
  );

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | null>(null);

  const [pages, setPages] = useState<PageItem[]>([]);

  const [lockedPages, setLockedPages] = useState<number[]>(
    []
  );

  const [loadingDocuments, setLoadingDocuments] =
    useState(true);

  const [loadingPages, setLoadingPages] =
    useState(false);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [error, setError] = useState("");

  const [result, setResult] =
    useState<RiskAnalysisResult | null>(null);

  const [expandedPages, setExpandedPages] =
    useState<number[]>([]);

  // ========================================
  // Load Documents
  // ========================================

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoadingDocuments(true);
        setError("");

        const data = await getDocuments();

        const documentList: DocumentItem[] =
          Array.isArray(data)
            ? data
            : data.documents || [];

        setDocuments(documentList);

        if (documentList.length > 0) {
          setSelectedDocumentId(
            documentList[0].id
          );
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

    const documentId =
      selectedDocumentId;

    async function loadPages() {
      try {
        setLoadingPages(true);
        setError("");
        setResult(null);
        setLockedPages([]);
        setExpandedPages([]);

        const data =
          await getDocumentText(documentId);

        const documentPages: PageItem[] =
          Array.isArray(data.pages)
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

  function togglePageLock(
    pageNumber: number
  ) {
    setLockedPages((current) => {
      if (current.includes(pageNumber)) {
        return current.filter(
          (page) =>
            page !== pageNumber
        );
      }

      return [
        ...current,
        pageNumber,
      ].sort((a, b) => a - b);
    });

    setResult(null);
    setError("");
  }

  // ========================================
  // Toggle Page Preview
  // ========================================

  function togglePagePreview(
    pageNumber: number
  ) {
    setExpandedPages((current) => {
      if (current.includes(pageNumber)) {
        return current.filter(
          (page) =>
            page !== pageNumber
        );
      }

      return [
        ...current,
        pageNumber,
      ];
    });
  }

  // ========================================
  // Run AI Risk Analysis
  // ========================================

  async function handleRiskAnalysis() {
    if (selectedDocumentId === null) {
      setError(
        "Please select a document first."
      );

      return;
    }

    if (pages.length === 0) {
      setError(
        "No readable pages are available for analysis."
      );

      return;
    }

    if (
      lockedPages.length ===
      pages.length
    ) {
      setError(
        "All pages are locked. Unlock at least one page before running risk analysis."
      );

      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setResult(null);

      const data =
        await analyzeDocumentRisk(
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

  const selectedDocument =
    documents.find(
      (document) =>
        document.id ===
        selectedDocumentId
    );

  const unlockedPageCount =
    Math.max(
      pages.length -
        lockedPages.length,
      0
    );

  // ========================================
  // Loading Documents
  // ========================================

  if (loadingDocuments) {
    return (
      <main className="relative min-h-full pb-8">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-3xl" />

          <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/[0.04] blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-[60vh] items-center justify-center">
          <div className="rounded-3xl border border-white/[0.07] bg-slate-900/70 px-10 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <Loader2
                size={24}
                className="animate-spin text-cyan-400"
              />
            </div>

            <p className="mt-5 text-sm font-medium text-slate-300">
              Loading documents
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Preparing your risk analysis workspace...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // Main Page
  // ========================================

  return (
    <main className="relative min-h-full space-y-8 pb-8">
      {/* Ambient Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/[0.04] blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/[0.025] blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* ========================================
            Header
        ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/70 p-6 shadow-2xl shadow-black/15 backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-medium text-cyan-300">
                <ShieldAlert size={14} />

                AI Risk Intelligence
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                AI Risk Analysis
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Analyze legal documents, protect
                sensitive pages and identify
                potential contractual, legal,
                compliance and operational risks.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-300">
                  Privacy Controls
                </p>

                <p className="mt-0.5 text-[11px] text-slate-600">
                  Page-level protection enabled
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            Document Selection
        ======================================== */}

        <section className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.07] text-cyan-400">
                  <FileText size={18} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    Select Document
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Choose the document you want
                    LexAI to analyze.
                  </p>
                </div>
              </div>
            </div>

            {documents.length > 0 && (
              <div className="rounded-full border border-white/[0.06] bg-slate-950/50 px-3 py-1.5 text-xs text-slate-500">
                {documents.length}{" "}
                {documents.length === 1
                  ? "document"
                  : "documents"}{" "}
                available
              </div>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/[0.08] bg-slate-950/30 p-7 text-center">
              <FileText
                size={24}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm font-medium text-slate-400">
                No documents available
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Upload a legal document before
                starting risk analysis.
              </p>
            </div>
          ) : (
            <>
              <div className="relative mt-6">
                <select
                  value={
                    selectedDocumentId ?? ""
                  }
                  onChange={(event) => {
                    const value = Number(
                      event.target.value
                    );

                    setSelectedDocumentId(
                      Number.isNaN(value)
                        ? null
                        : value
                    );
                  }}
                  className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-slate-950/70 px-4 py-4 pr-12 text-sm text-white outline-none transition focus:border-cyan-400/30 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/5"
                >
                  {documents.map(
                    (document) => (
                      <option
                        key={document.id}
                        value={document.id}
                      >
                        {document.filename}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>

              {selectedDocument && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <FileText size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-600">
                      Selected Document
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-white">
                      {selectedDocument.filename}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* ========================================
            Page Protection
        ======================================== */}

        {selectedDocumentId !== null && (
          <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/60 shadow-xl shadow-black/10 backdrop-blur-xl">
            {/* Section Header */}

            <div className="border-b border-white/[0.06] p-6 sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/[0.07] text-amber-300">
                      <LockKeyhole size={18} />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-white">
                        Protect Pages
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-600">
                        Control which pages are included
                        in AI risk analysis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 px-4 py-2.5">
                    <span className="text-xs text-slate-500">
                      Protected
                    </span>

                    <span className="ml-2 text-sm font-semibold text-red-300">
                      {lockedPages.length}
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 px-4 py-2.5">
                    <span className="text-xs text-slate-500">
                      Analyzable
                    </span>

                    <span className="ml-2 text-sm font-semibold text-emerald-300">
                      {unlockedPageCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page List */}

            <div className="p-6 sm:p-7">
              {loadingPages ? (
                <div className="rounded-2xl border border-white/[0.06] bg-slate-950/30 p-10 text-center">
                  <Loader2
                    size={23}
                    className="mx-auto animate-spin text-cyan-400"
                  />

                  <p className="mt-4 text-sm text-slate-400">
                    Loading document pages...
                  </p>
                </div>
              ) : pages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-slate-950/30 p-10 text-center">
                  <FileText
                    size={23}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-4 text-sm text-slate-400">
                    No readable pages found.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pages.map((page) => {
                    const isLocked =
                      lockedPages.includes(
                        page.page_number
                      );

                    const isExpanded =
                      expandedPages.includes(
                        page.page_number
                      );

                    return (
                      <div
                        key={
                          page.page_number
                        }
                        className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                          isLocked
                            ? "border-red-400/15 bg-red-400/[0.035]"
                            : "border-white/[0.06] bg-slate-950/40 hover:border-white/[0.10]"
                        }`}
                      >
                        {/* Page Header */}

                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                                isLocked
                                  ? "bg-red-400/10 text-red-300"
                                  : "bg-emerald-400/10 text-emerald-300"
                              }`}
                            >
                              {page.page_number}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-white">
                                  Page{" "}
                                  {
                                    page.page_number
                                  }
                                </p>

                                {isLocked ? (
                                  <Lock
                                    size={13}
                                    className="text-red-400"
                                  />
                                ) : (
                                  <CheckCircle2
                                    size={13}
                                    className="text-emerald-400"
                                  />
                                )}
                              </div>

                              <p
                                className={`mt-1 text-xs ${
                                  isLocked
                                    ? "text-red-300/60"
                                    : "text-emerald-300/60"
                                }`}
                              >
                                {isLocked
                                  ? "Protected from AI analysis"
                                  : "Available for AI analysis"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:shrink-0">
                            {!isLocked && (
                              <button
                                type="button"
                                onClick={() =>
                                  togglePagePreview(
                                    page.page_number
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-slate-800/60 px-3.5 py-2.5 text-xs font-medium text-slate-400 transition hover:border-white/[0.12] hover:bg-slate-800 hover:text-white"
                              >
                                {isExpanded ? (
                                  <>
                                    Hide Text
                                    <ChevronUp
                                      size={14}
                                    />
                                  </>
                                ) : (
                                  <>
                                    Preview
                                    <ChevronDown
                                      size={14}
                                    />
                                  </>
                                )}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                togglePageLock(
                                  page.page_number
                                )
                              }
                              className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                                isLocked
                                  ? "border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300 hover:bg-emerald-400/10"
                                  : "border border-red-400/15 bg-red-400/[0.07] text-red-300 hover:bg-red-400/10"
                              }`}
                            >
                              {isLocked ? (
                                <>
                                  <Unlock
                                    size={14}
                                  />
                                  Unlock
                                </>
                              ) : (
                                <>
                                  <Lock
                                    size={14}
                                  />
                                  Lock Page
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Text */}

                        {!isLocked &&
                          isExpanded && (
                            <div className="border-t border-white/[0.06] px-4 pb-4 sm:px-5 sm:pb-5">
                              <div className="mt-4 max-h-48 overflow-y-auto rounded-xl border border-white/[0.05] bg-slate-900/70 p-4">
                                <p className="whitespace-pre-wrap text-xs leading-6 text-slate-400">
                                  {page.text?.trim() ||
                                    "No readable text on this page."}
                                </p>
                              </div>
                            </div>
                          )}

                        {/* Locked Notice */}

                        {isLocked && (
                          <div className="border-t border-red-400/10 px-4 pb-4 sm:px-5 sm:pb-5">
                            <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.04] p-3.5">
                              <Lock
                                size={15}
                                className="shrink-0 text-red-400"
                              />

                              <p className="text-xs leading-5 text-red-300/70">
                                This page is protected
                                and excluded from AI
                                risk analysis.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Analyze Action */}

              <div className="mt-7 border-t border-white/[0.06] pt-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Ready for analysis?
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {unlockedPageCount} of{" "}
                      {pages.length} pages are
                      available to the AI.
                    </p>
                  </div>

                  {lockedPages.length ===
                    pages.length &&
                    pages.length > 0 && (
                      <span className="text-xs text-red-300">
                        Unlock at least one page
                      </span>
                    )}
                </div>

                <button
                  type="button"
                  onClick={
                    handleRiskAnalysis
                  }
                  disabled={
                    analyzing ||
                    loadingPages ||
                    pages.length === 0 ||
                    lockedPages.length ===
                      pages.length
                  }
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition-all duration-200 hover:bg-cyan-300 hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
                >
                  {analyzing ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Analyzing Document with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles
                        size={18}
                        className="transition-transform group-hover:scale-110"
                      />

                      Run AI Risk Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ========================================
            Error
        ======================================== */}

        {error && (
          <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-5 shadow-xl shadow-black/10">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                <AlertCircle size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-red-300">
                  Risk analysis notice
                </p>

                <p className="mt-1 text-xs leading-5 text-red-300/75">
                  {error}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ========================================
            Risk Results
        ======================================== */}

        {result && (
          <div className="space-y-7">
            {/* Result Header */}

            <section className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/[0.07] blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.07] px-3 py-1.5 text-[11px] font-medium text-cyan-300">
                    <CheckCircle2 size={13} />

                    AI Analysis Complete
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {result.filename}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    AI analyzed{" "}
                    <span className="font-medium text-slate-300">
                      {
                        result.analyzed_page_count
                      }
                    </span>{" "}
                    unlocked page
                    {result.analyzed_page_count !==
                    1
                      ? "s"
                      : ""}
                    {result.locked_pages
                      .length > 0 && (
                      <>
                        {" "}
                        while{" "}
                        <span className="font-medium text-red-300">
                          {
                            result
                              .locked_pages
                              .length
                          }
                        </span>{" "}
                        protected page
                        {result.locked_pages
                          .length !==
                        1
                          ? "s"
                          : ""}{" "}
                        remained excluded.
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-slate-950/40 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Brain size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                      Analysis
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {result.analyzed_page_count}{" "}
                      pages reviewed
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Score + Risk Level */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Risk Score
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Overall assessment from the
                      analyzed document content
                    </p>
                  </div>

                  <ShieldAlert
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <RiskScoreCard
                  score={
                    result.overall_score
                  }
                />
              </div>

              <div className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Overall Risk Level
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Current document assessment
                    </p>
                  </div>

                  <ShieldCheck
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <div
                  className={`mt-7 flex items-center justify-center rounded-2xl border px-5 py-8 ${
                    result.risk_level ===
                    "High"
                      ? "border-red-400/15 bg-red-400/[0.06]"
                      : result.risk_level ===
                        "Medium"
                      ? "border-amber-400/15 bg-amber-400/[0.06]"
                      : "border-emerald-400/15 bg-emerald-400/[0.06]"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
                        result.risk_level ===
                        "High"
                          ? "bg-red-400/10 text-red-400"
                          : result.risk_level ===
                            "Medium"
                          ? "bg-amber-400/10 text-amber-400"
                          : "bg-emerald-400/10 text-emerald-400"
                      }`}
                    >
                      {result.risk_level ===
                      "High" ? (
                        <ShieldAlert
                          size={21}
                        />
                      ) : result.risk_level ===
                        "Medium" ? (
                        <AlertCircle
                          size={21}
                        />
                      ) : (
                        <ShieldCheck
                          size={21}
                        />
                      )}
                    </div>

                    <p
                      className={`mt-4 text-2xl font-semibold ${
                        result.risk_level ===
                        "High"
                          ? "text-red-300"
                          : result.risk_level ===
                            "Medium"
                          ? "text-amber-300"
                          : "text-emerald-300"
                      }`}
                    >
                      {result.risk_level} Risk
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}

            <section className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.07] text-cyan-400">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    AI Risk Summary
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Generated assessment of the analyzed
                    content
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-6">
                <div className="prose prose-invert max-w-none text-sm leading-7 prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300 prose-a:text-cyan-300">
                  <ReactMarkdown>
                    {result.summary}
                  </ReactMarkdown>
                </div>
              </div>
            </section>

            {/* Identified Risks */}

            <section className="space-y-5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/[0.07] text-red-400">
                    <ShieldAlert size={18} />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-white">
                      Identified Risks
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-600">
                      Potential issues detected by the
                      AI analysis
                    </p>
                  </div>
                </div>
              </div>

              {result.risks.length ===
              0 ? (
                <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.04] p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      size={19}
                      className="text-emerald-400"
                    />

                    <p className="text-sm font-medium text-emerald-300">
                      No significant risks were
                      identified in the unlocked
                      document content.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {result.risks.map(
                    (risk, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6"
                      >
                        <ClauseCard
                          clause={`${risk.title} — Page ${risk.page}`}
                          risk={
                            risk.severity
                          }
                        />

                        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-slate-950/30 p-5">
                          <p className="text-sm leading-7 text-slate-300">
                            {risk.description}
                          </p>

                          {risk.recommendation && (
                            <div className="mt-5 border-t border-white/[0.06] pt-5">
                              <div className="flex items-center gap-2">
                                <Sparkles
                                  size={15}
                                  className="text-cyan-400"
                                />

                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
                                  Recommendation
                                </p>
                              </div>

                              <p className="mt-2 text-sm leading-6 text-slate-400">
                                {
                                  risk.recommendation
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* Recommendations */}

            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.07] text-cyan-400">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    AI Recommendations
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Suggested actions based on the analysis
                  </p>
                </div>
              </div>

              {result.recommendations
                .length > 0 ? (
                <div className="space-y-4">
                  {result.recommendations.map(
                    (
                      recommendation,
                      index
                    ) => (
                      <RecommendationCard
                        key={index}
                        recommendation={
                          recommendation
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <RecommendationCard
                  recommendation="No additional recommendations were generated from the available document content."
                />
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default RiskAnalysisPage;