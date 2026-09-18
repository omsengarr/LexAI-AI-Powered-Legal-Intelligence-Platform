import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  getDocuments,
  getDocumentText,
  analyzeDocumentPages,
  summarizeDocument,
} from "../../services/api";

import {
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  LockKeyhole,
  Loader2,
  ShieldCheck,
  Sparkles,
  Unlock,
  AlertCircle,
  BarChart3,
} from "lucide-react";

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

  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [loadingPages, setLoadingPages] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [summaryResult, setSummaryResult] =
    useState<SummaryResult | null>(null);

  const [error, setError] = useState("");
  const [analysisError, setAnalysisError] = useState("");
  const [summaryError, setSummaryError] = useState("");

  const [expandedPages, setExpandedPages] = useState<number[]>([]);

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
      console.error("Failed to load documents:", err);

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
      setExpandedPages([]);
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
      setExpandedPages([]);

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
      if (currentLockedPages.includes(pageNumber)) {
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
     * AI results become stale whenever
     * the privacy configuration changes.
     */
    setAnalysisResult(null);
    setSummaryResult(null);

    setAnalysisError("");
    setSummaryError("");
  }

  /*
   * Expand / collapse page preview.
   */
  function togglePagePreview(pageNumber: number) {
    setExpandedPages((current) => {
      if (current.includes(pageNumber)) {
        return current.filter(
          (page) => page !== pageNumber
        );
      }

      return [...current, pageNumber];
    });
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

    if (lockedPages.length === pages.length) {
      setAnalysisError(
        "All pages are locked. Unlock at least one page before analyzing."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisError("");
      setAnalysisResult(null);

      const result = await analyzeDocumentPages(
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
   * Generate summary using only unlocked pages.
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

    if (lockedPages.length === pages.length) {
      setSummaryError(
        "All pages are locked. Unlock at least one page before generating a summary."
      );
      return;
    }

    try {
      setSummarizing(true);
      setSummaryError("");
      setSummaryResult(null);

      const result = await summarizeDocument(
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

  const selectedDocument = documents.find(
    (document) =>
      document.id === selectedDocumentId
  );

  const unlockedPageCount = Math.max(
    pages.length - lockedPages.length,
    0
  );

  const allPagesLocked =
    pages.length > 0 &&
    lockedPages.length === pages.length;

  const hasLockedPages = lockedPages.length > 0;

  return (
    <div className="document-analysis-page min-h-screen bg-slate-50 px-4 py-6 text-slate-900 transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px]">

        {/* =========================================================
            PAGE HEADER
        ========================================================== */}

        <section className="mb-8">
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-sm backdrop-blur-xl transition-colors duration-300 sm:px-8 lg:px-10">

            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-purple-400/10 blur-3xl" />

            <div className="relative z-10">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-600">
                <Sparkles className="h-4 w-4" />
                Document Intelligence
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                <div className="max-w-4xl">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                    Page Lock &{" "}
                    <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-500 bg-clip-text text-transparent">
                      AI Analysis.
                    </span>
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                    Protect private pages before sending document
                    content to LexAI. Analyze and summarize only
                    the pages you choose to make available.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

                  <ShieldCheck className="h-5 w-5 text-emerald-500" />

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Privacy Control
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      Client-side page selection
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            GLOBAL ERROR
        ========================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* =========================================================
            DOCUMENT SELECTOR
        ========================================================== */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-2">

                <FileText className="h-5 w-5 text-cyan-500" />

                <h2 className="text-lg font-semibold text-slate-950">
                  Select Document
                </h2>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                Choose the document you want to protect and analyze.
              </p>
            </div>

            {documents.length > 0 && (
              <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                {documents.length}{" "}
                {documents.length === 1
                  ? "document"
                  : "documents"}
              </div>
            )}

          </div>

          {loadingDocuments ? (

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">

              <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />

              Loading documents...

            </div>

          ) : documents.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">

              <FileText className="mx-auto h-8 w-8 text-slate-400" />

              <p className="mt-3 font-medium text-slate-700">
                No documents have been uploaded yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Upload a document first to use Page Lock & Analysis.
              </p>

            </div>

          ) : (

            <div className="relative">

              <select
                id="document-select"
                value={selectedDocumentId ?? ""}
                onChange={(event) =>
                  setSelectedDocumentId(
                    Number(event.target.value)
                  )
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-sm font-medium text-slate-900 outline-none transition-all duration-200 hover:border-cyan-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
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

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

            </div>

          )}
        </section>

        {/* =========================================================
            SELECTED DOCUMENT
        ========================================================== */}

        {selectedDocument && (
          <>

            {/* =====================================================
                DOCUMENT CONTROL HEADER
            ====================================================== */}

            <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="p-5 sm:p-6 lg:p-7">

                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                  {/* Document information */}

                  <div className="min-w-0">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-500">

                        <FileText className="h-6 w-6" />

                      </div>

                      <div className="min-w-0">

                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-500">
                          Active document
                        </p>

                        <h2 className="truncate text-xl font-bold text-slate-950 sm:text-2xl">
                          {selectedDocument.filename}
                        </h2>

                      </div>

                    </div>

                    {/* Counters */}

                    <div className="mt-5 flex flex-wrap gap-3">

                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                        <span className="text-lg font-bold text-slate-900">
                          {pages.length}
                        </span>

                        <span className="ml-2 text-xs text-slate-500">
                          {pages.length === 1
                            ? "page"
                            : "pages"}
                        </span>
                      </div>

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                        <span className="text-lg font-bold text-emerald-600">
                          {unlockedPageCount}
                        </span>

                        <span className="ml-2 text-xs text-emerald-700/70">
                          unlocked
                        </span>
                      </div>

                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
                        <span className="text-lg font-bold text-red-600">
                          {lockedPages.length}
                        </span>

                        <span className="ml-2 text-xs text-red-700/70">
                          locked
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* AI ACTION BUTTONS */}

                  <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">

                    <button
                      type="button"
                      onClick={handleSummarizeDocument}
                      disabled={
                        summarizing ||
                        analyzing ||
                        loadingPages ||
                        pages.length === 0 ||
                        allPagesLocked
                      }
                      className="group inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:flex-none"
                    >

                      {summarizing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-6" />
                      )}

                      {summarizing
                        ? "Summarizing..."
                        : "Summarize Document"}

                    </button>

                    <button
                      type="button"
                      onClick={handleAnalyzeUnlockedPages}
                      disabled={
                        analyzing ||
                        summarizing ||
                        loadingPages ||
                        pages.length === 0 ||
                        allPagesLocked
                      }
                      className="group inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl border border-purple-400/30 bg-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-400 hover:shadow-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:flex-none"
                    >

                      {analyzing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4 transition-transform group-hover:scale-110" />
                      )}

                      {analyzing
                        ? "Analyzing..."
                        : "Analyze Unlocked Pages"}

                    </button>

                  </div>
                </div>

                {/* PRIVACY STATUS */}

                <div
                  className={`mt-6 flex items-start gap-3 rounded-2xl border px-4 py-4 ${
                    hasLockedPages
                      ? "border-red-200 bg-red-50"
                      : "border-emerald-200 bg-emerald-50"
                  }`}
                >

                  {hasLockedPages ? (
                    <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  ) : (
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  )}

                  <div className="min-w-0">

                    <p
                      className={`text-sm font-semibold ${
                        hasLockedPages
                          ? "text-red-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {hasLockedPages
                        ? "Privacy protection is active"
                        : "All pages are currently available"}
                    </p>

                    <p
                      className={`mt-1 text-xs leading-5 ${
                        hasLockedPages
                          ? "text-red-700/70"
                          : "text-emerald-700/70"
                      }`}
                    >
                      {hasLockedPages
                        ? `${lockedPages.length} ${
                            lockedPages.length === 1
                              ? "page is"
                              : "pages are"
                          } locked and will be excluded from AI analysis and document summarization.`
                        : "You can lock private pages below before sending this document for AI analysis or summarization."}
                    </p>

                  </div>
                </div>

              </div>
            </section>

            {/* =====================================================
                PAGE PROTECTION HEADER
            ====================================================== */}

            <section className="mb-5">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <Lock className="h-5 w-5 text-cyan-500" />

                    <h2 className="text-xl font-bold text-slate-950">
                      Page Protection
                    </h2>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Select individual pages that should remain private.
                  </p>

                </div>

                {pages.length > 0 && (
                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 sm:self-auto">

                    <span className="h-2 w-2 rounded-full bg-cyan-400" />

                    {lockedPages.length} of {pages.length} protected

                  </div>
                )}

              </div>
            </section>

            {/* =====================================================
                PAGE LIST
            ====================================================== */}

            <div className="space-y-4">

              {loadingPages ? (

                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-500" />

                  <p className="mt-4 font-medium text-slate-700">
                    Loading document pages...
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Preparing page-level privacy controls.
                  </p>

                </div>

              ) : pages.length === 0 ? (

                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">

                  <FileText className="mx-auto h-9 w-9 text-slate-400" />

                  <p className="mt-4 font-semibold text-slate-700">
                    No readable pages found
                  </p>

                  <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                    LexAI could not find readable page content in
                    this document.
                  </p>

                </div>

              ) : (

                pages.map((page) => {

                  const isLocked = lockedPages.includes(
                    page.page_number
                  );

                  const isExpanded = expandedPages.includes(
                    page.page_number
                  );

                  return (
                    <article
                      key={page.page_number}
                      className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 ${
                        isLocked
                          ? "border-red-300/70"
                          : "border-slate-200"
                      }`}
                    >

                      {/* PAGE HEADER */}

                      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                        <div className="flex min-w-0 items-center gap-4">

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                              isLocked
                                ? "border-red-300 bg-red-50 text-red-500"
                                : "border-emerald-300 bg-emerald-50 text-emerald-500"
                            }`}
                          >
                            {isLocked ? (
                              <LockKeyhole className="h-5 w-5" />
                            ) : (
                              <Unlock className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="text-base font-bold text-slate-950 sm:text-lg">
                                Page {page.page_number}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                  isLocked
                                    ? "bg-red-100 text-red-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {isLocked
                                  ? "Private"
                                  : "Available"}
                              </span>

                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              {isLocked
                                ? "This page will be excluded from AI processing."
                                : "This page can be used for AI analysis and summarization."}
                            </p>

                          </div>
                        </div>

                        <div className="flex w-full gap-2 sm:w-auto">

                          {!isLocked && (
                            <button
                              type="button"
                              onClick={() =>
                                togglePagePreview(
                                  page.page_number
                                )
                              }
                              className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 sm:flex-none"
                            >

                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}

                              {isExpanded
                                ? "Hide Preview"
                                : "Preview"}

                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              togglePageLock(
                                page.page_number
                              )
                            }
                            className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all sm:flex-none ${
                              isLocked
                                ? "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >

                            {isLocked ? (
                              <Unlock className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}

                            {isLocked
                              ? "Unlock Page"
                              : "Lock Page"}

                          </button>

                        </div>
                      </div>

                      {/* LOCKED PAGE */}

                      {isLocked ? (

                        <div className="border-t border-red-200 bg-red-50/70 px-5 py-8 sm:px-6">

                          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-300 bg-red-100 text-red-500">

                              <LockKeyhole className="h-7 w-7" />

                            </div>

                            <h4 className="mt-4 text-base font-bold text-red-800">
                              Private page protected
                            </h4>

                            <p className="mt-1 max-w-lg text-sm leading-6 text-red-700/70">
                              The contents of this page will not be
                              included when LexAI generates the document
                              summary or AI analysis.
                            </p>

                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-red-600">

                              <ShieldCheck className="h-3.5 w-3.5" />

                              Excluded from AI

                            </div>

                          </div>
                        </div>

                      ) : (

                        <>

                          {/* COLLAPSED PAGE */}

                          {!isExpanded && (

                            <div className="border-t border-slate-200 bg-slate-50/60 px-5 py-4">

                              <div className="flex items-center justify-between gap-4">

                                <div className="flex min-w-0 items-center gap-2">

                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />

                                  <span className="truncate text-xs text-slate-500">
                                    Page content is available for AI
                                    processing.
                                  </span>

                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    togglePagePreview(
                                      page.page_number
                                    )
                                  }
                                  className="shrink-0 text-xs font-semibold text-cyan-600 hover:text-cyan-500"
                                >
                                  View
                                </button>

                              </div>

                            </div>
                          )}

                          {/* EXPANDED PAGE */}

                          {isExpanded && (

                            <div className="border-t border-slate-200 p-5 sm:p-6">

                              <div className="mb-3 flex items-center justify-between gap-4">

                                <div>

                                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-500">
                                    Page Preview
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    Extracted document content
                                  </p>

                                </div>

                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-500">
                                  Read-only
                                </span>

                              </div>

                              <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">

                                {page.text?.trim()
                                  ? page.text
                                  : "No readable text was extracted from this page."}

                              </div>

                            </div>

                          )}

                        </>

                      )}

                    </article>
                  );
                })

              )}

            </div>

            {/* =====================================================
                SUMMARY ERROR
            ====================================================== */}

            {summaryError && (

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <div>

                  <p className="font-semibold">
                    Summary error
                  </p>

                  <p className="mt-1 text-sm">
                    {summaryError}
                  </p>

                </div>

              </div>
            )}

            {/* =====================================================
                DOCUMENT SUMMARY
            ====================================================== */}

            {summaryResult?.summary && (

              <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-purple-50 p-5 sm:p-6">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-400/10 text-cyan-500">

                        <Sparkles className="h-6 w-6" />

                      </div>

                      <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-500">
                          AI Document Intelligence
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                          AI Document Summary
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Generated using only unlocked pages.
                        </p>

                      </div>

                    </div>

                    {summaryResult.summarized_page_count !==
                      undefined && (

                      <div className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700">

                        <BarChart3 className="h-4 w-4" />

                        {summaryResult.summarized_page_count}{" "}
                        pages analyzed

                      </div>

                    )}

                  </div>

                </div>

                <div className="p-5 sm:p-6 lg:p-8">

                  <div className="mb-7 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">

                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                    <div>

                      <p className="text-sm font-semibold text-emerald-700">
                        Privacy protection applied
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700/70">

                        Locked pages were excluded from this summary.

                        {summaryResult.locked_pages &&
                          summaryResult.locked_pages.length > 0 && (
                            <>
                              {" "}
                              Locked pages:{" "}
                              {summaryResult.locked_pages.join(
                                ", "
                              )}
                              .
                            </>
                          )}

                      </p>

                    </div>

                  </div>

                  <div className="prose prose-slate max-w-none">

                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="mb-4 mt-3 text-2xl font-bold tracking-tight text-slate-950">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="mb-3 mt-7 text-xl font-bold text-cyan-700">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-800">
                            {children}
                          </h3>
                        ),

                        p: ({ children }) => (
                          <p className="mb-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                            {children}
                          </p>
                        ),

                        ul: ({ children }) => (
                          <ul className="mb-5 ml-5 list-disc space-y-2 text-sm leading-7 text-slate-600">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="mb-5 ml-5 list-decimal space-y-2 text-sm leading-7 text-slate-600">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li className="pl-1">
                            {children}
                          </li>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900">
                            {children}
                          </strong>
                        ),

                        blockquote: ({ children }) => (
                          <blockquote className="my-5 rounded-2xl border-l-4 border-cyan-400 bg-cyan-50 px-5 py-4 text-slate-600">
                            {children}
                          </blockquote>
                        ),

                        code: ({ children }) => (
                          <code className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-cyan-700">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {summaryResult.summary}
                    </ReactMarkdown>

                  </div>

                </div>
              </section>
            )}

            {/* =====================================================
                ANALYSIS ERROR
            ====================================================== */}

            {analysisError && (

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <div>

                  <p className="font-semibold">
                    Analysis error
                  </p>

                  <p className="mt-1 text-sm">
                    {analysisError}
                  </p>

                </div>

              </div>
            )}

            {/* =====================================================
                AI ANALYSIS RESULT
            ====================================================== */}

            {analysisResult?.analysis && (

              <section className="mt-8 overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 bg-gradient-to-r from-purple-50 via-white to-cyan-50 p-5 sm:p-6">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-300/40 bg-purple-400/10 text-purple-500">

                      <Brain className="h-6 w-6" />

                    </div>

                    <div>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-500">
                        Legal Intelligence
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                        AI Analysis
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Analysis generated using only unlocked pages.
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-5 sm:p-6 lg:p-8">

                  <div className="mb-7 flex items-start gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-4">

                    <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-purple-500" />

                    <div>

                      <p className="text-sm font-semibold text-purple-700">
                        Protected pages excluded
                      </p>

                      <p className="mt-1 text-xs leading-5 text-purple-700/70">

                        Locked pages were excluded from this AI analysis.

                        {analysisResult.locked_pages &&
                          analysisResult.locked_pages.length > 0 && (
                            <>
                              {" "}
                              Locked pages:{" "}
                              {analysisResult.locked_pages.join(
                                ", "
                              )}
                              .
                            </>
                          )}

                      </p>

                    </div>

                  </div>

                  <div className="prose prose-slate max-w-none">

                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="mb-4 mt-3 text-2xl font-bold tracking-tight text-slate-950">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="mb-3 mt-7 text-xl font-bold text-purple-700">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-800">
                            {children}
                          </h3>
                        ),

                        p: ({ children }) => (
                          <p className="mb-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                            {children}
                          </p>
                        ),

                        ul: ({ children }) => (
                          <ul className="mb-5 ml-5 list-disc space-y-2 text-sm leading-7 text-slate-600">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="mb-5 ml-5 list-decimal space-y-2 text-sm leading-7 text-slate-600">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li className="pl-1">
                            {children}
                          </li>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900">
                            {children}
                          </strong>
                        ),

                        blockquote: ({ children }) => (
                          <blockquote className="my-5 rounded-2xl border-l-4 border-purple-400 bg-purple-50 px-5 py-4 text-slate-600">
                            {children}
                          </blockquote>
                        ),

                        code: ({ children }) => (
                          <code className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-purple-700">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {analysisResult.analysis}
                    </ReactMarkdown>

                  </div>

                </div>

              </section>
            )}

            {/* =====================================================
                BOTTOM PRIVACY SUMMARY
            ====================================================== */}

            <section className="mt-8 pb-8">

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-500">

                      <ShieldCheck className="h-5 w-5" />

                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        Privacy configuration
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Only unlocked pages are sent to the AI
                        analysis and summarization endpoints.
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">

                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                      {unlockedPageCount} available
                    </span>

                    <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 font-medium text-red-700">
                      {lockedPages.length} protected
                    </span>

                  </div>

                </div>

              </div>

            </section>

          </>
        )}
      </div>
    </div>
  );
}