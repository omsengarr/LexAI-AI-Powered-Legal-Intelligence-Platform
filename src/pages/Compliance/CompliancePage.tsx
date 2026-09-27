import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import ComplianceScoreCard from "../../components/compliance/ComplianceScoreCard";
import ComplianceItem from "../../components/compliance/ComplianceItem";
import ComplianceSuggestion from "../../components/compliance/ComplianceSuggestion";

import {
  analyzeDocumentCompliance,
  getDocuments,
} from "../../services/api";

interface DocumentItem {
  id: number;
  filename?: string;
  file_name?: string;
  name?: string;
}

interface ComplianceCheck {
  title: string;
  status: boolean;
  page?: number;
  description?: string;
}

interface ComplianceResult {
  success: boolean;
  message?: string;
  document_id: number;
  filename: string;
  regulation: string;
  total_pages: number;
  locked_pages: number[];
  analyzed_pages: number[];
  analyzed_page_count: number;
  overall_score: number;
  compliance_level: string;
  summary: string;
  checks: ComplianceCheck[];
  recommendations: string[];
}

function CompliancePage() {
  const [regulation, setRegulation] = useState("GDPR");

  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | "">("");

  const [lockedPages] = useState<number[]>([]);

  const [result, setResult] =
    useState<ComplianceResult | null>(null);

  const [loadingDocuments, setLoadingDocuments] =
    useState(true);

  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");

  // ========================================
  // Load Documents
  // ========================================

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoadingDocuments(true);
        setError("");

        const data = await getDocuments();

        const documentList = Array.isArray(data)
          ? data
          : Array.isArray(data?.documents)
          ? data.documents
          : [];

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
    };

    loadDocuments();
  }, []);

  // ========================================
  // Compliance Counts
  // ========================================

  const compliantCount =
    result?.checks.filter(
      (item) => item.status
    ).length ?? 0;

  const issueCount =
    result
      ? result.checks.length - compliantCount
      : 0;

  const compliancePercentage =
    result && result.checks.length > 0
      ? Math.round(
          (compliantCount / result.checks.length) * 100
        )
      : 0;

  // ========================================
  // Run Compliance Analysis
  // ========================================

  const handleAnalyze = async () => {
    if (!selectedDocumentId) {
      setError("Please select a document first.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setResult(null);

      const data =
        await analyzeDocumentCompliance(
          Number(selectedDocumentId),
          regulation,
          lockedPages
        );

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze document compliance."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* ========================================
          Ambient Background
      ======================================== */}

      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10 space-y-8">

        {/* ========================================
            Page Header
        ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.05]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                AI Compliance Intelligence
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Compliance Checker
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Check your legal documents against important regulatory
                requirements and identify areas that need attention.
              </p>

            </div>

            {/* Protection Status */}

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <LockKeyhole className="h-5 w-5 text-cyan-300" />
              </div>

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Analysis Engine
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  {analyzing
                    ? "Analyzing..."
                    : "Ready"}

                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================
            Regulation + Document Selection
        ======================================== */}

        <section className="grid gap-6 xl:grid-cols-[1.1fr_1.9fr]">

          {/* Regulation Selection */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                <FileCheck2 className="h-5 w-5 text-cyan-300" />
              </div>

              <div>

                <h2 className="font-semibold text-white">
                  Regulatory Framework
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select the regulation to evaluate against.
                </p>

              </div>

            </div>

            <label
              htmlFor="regulation"
              className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
            >
              Select Regulation
            </label>

            <div className="relative mt-3">

              <select
                id="regulation"
                value={regulation}
                onChange={(e) => {
                  setRegulation(e.target.value);
                  setResult(null);
                }}
                className="
                  w-full
                  appearance-none
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-950/80
                  px-4
                  py-3.5
                  pr-10
                  text-sm
                  font-medium
                  text-white
                  outline-none
                  transition
                  hover:border-slate-600
                  focus:border-cyan-500/60
                  focus:ring-2
                  focus:ring-cyan-500/10
                "
              >

                <option value="GDPR">
                  GDPR
                </option>

                <option value="DPDP">
                  DPDP
                </option>

                <option value="HIPAA">
                  HIPAA
                </option>

              </select>

              <Activity className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">

              <Sparkles className="h-4 w-4 text-cyan-300" />

              <p className="text-xs leading-5 text-slate-500">

                Current analysis framework:{" "}

                <span className="font-semibold text-slate-300">
                  {regulation}
                </span>

              </p>

            </div>

          </div>

          {/* Document Selection */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                <FileCheck2 className="h-5 w-5 text-cyan-300" />
              </div>

              <div>

                <h2 className="font-semibold text-white">
                  Document
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the document to analyze.
                </p>

              </div>

            </div>

            <label
              htmlFor="document"
              className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
            >
              Select Document
            </label>

            <select
              id="document"
              value={selectedDocumentId}
              disabled={
                loadingDocuments ||
                analyzing ||
                documents.length === 0
              }
              onChange={(e) => {

                const value = e.target.value;

                setSelectedDocumentId(
                  value ? Number(value) : ""
                );

                setResult(null);
                setError("");

              }}
              className="
                mt-3
                w-full
                rounded-2xl
                border
                border-slate-700
                bg-slate-950/80
                px-4
                py-3.5
                text-sm
                font-medium
                text-white
                outline-none
                transition
                hover:border-slate-600
                focus:border-cyan-500/60
                focus:ring-2
                focus:ring-cyan-500/10
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loadingDocuments ? (

                <option value="">
                  Loading documents...
                </option>

              ) : documents.length === 0 ? (

                <option value="">
                  No documents available
                </option>

              ) : (

                documents.map((document) => (

                  <option
                    key={document.id}
                    value={document.id}
                  >
                    {document.filename ||
                      document.file_name ||
                      document.name ||
                      `Document ${document.id}`}
                  </option>

                ))

              )}

            </select>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={
                analyzing ||
                loadingDocuments ||
                !selectedDocumentId
              }
              className="
                mt-5
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-cyan-500
                px-5
                py-3.5
                text-sm
                font-semibold
                text-slate-950
                transition
                hover:bg-cyan-400
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <Sparkles className="h-4 w-4" />

              {analyzing
                ? "Analyzing Document..."
                : "Run Compliance Analysis"}

            </button>

          </div>

        </section>

        {/* ========================================
            Error Message
        ======================================== */}

        {error && (

          <section className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-5 py-4">

            <div className="flex items-start gap-3">

              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />

              <div>

                <p className="font-semibold text-rose-300">
                  Compliance analysis failed
                </p>

                <p className="mt-1 text-sm leading-6 text-rose-200/70">
                  {error}
                </p>

              </div>

            </div>

          </section>

        )}

        {/* ========================================
            Empty State
        ======================================== */}

        {!result && !analyzing && !error && (

          <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
              <Sparkles className="h-6 w-6 text-cyan-300" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Ready for compliance analysis
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Select a document and regulatory framework, then run the
              AI analysis to generate real compliance findings.
            </p>

          </section>

        )}

        {/* ========================================
            Loading State
        ======================================== */}

        {analyzing && (

          <section className="rounded-3xl border border-cyan-500/10 bg-slate-900/60 p-10 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <h2 className="mt-5 text-lg font-semibold text-white">
              AI is analyzing your document
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Checking unlocked pages against {regulation} requirements.
            </p>

          </section>

        )}

        {/* ========================================
            Results
        ======================================== */}

        {result && !analyzing && (

          <>

            {/* Quick Overview */}

            <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Compliance Overview
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {result.filename}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {result.summary}
                  </p>

                </div>

                <div className="shrink-0 rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-4">

                  <p className="text-xs text-slate-500">
                    Compliance Level
                  </p>

                  <p className="mt-1 text-lg font-bold text-white">
                    {result.compliance_level}
                  </p>

                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">

                  <div className="flex items-center gap-2">

                    <FileCheck2 className="h-4 w-4 text-slate-500" />

                    <p className="text-xs text-slate-500">
                      Requirements
                    </p>

                  </div>

                  <p className="mt-3 text-2xl font-bold text-white">
                    {result.checks.length}
                  </p>

                </div>

                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">

                  <div className="flex items-center gap-2">

                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                    <p className="text-xs text-slate-500">
                      Compliant
                    </p>

                  </div>

                  <p className="mt-3 text-2xl font-bold text-white">
                    {compliantCount}
                  </p>

                </div>

                <div className="rounded-2xl border border-rose-500/10 bg-rose-500/[0.04] p-4">

                  <div className="flex items-center gap-2">

                    <XCircle className="h-4 w-4 text-rose-400" />

                    <p className="text-xs text-slate-500">
                      Needs Attention
                    </p>

                  </div>

                  <p className="mt-3 text-2xl font-bold text-white">
                    {issueCount}
                  </p>

                </div>

              </div>

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between text-xs">

                  <span className="text-slate-500">
                    Requirement coverage
                  </span>

                  <span className="font-semibold text-cyan-300">
                    {compliancePercentage}%
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                    style={{
                      width: `${compliancePercentage}%`,
                    }}
                  />

                </div>

              </div>

              <div className="mt-4 text-xs text-slate-500">

                Analyzed {result.analyzed_page_count} of{" "}

                {result.total_pages} page
                {result.total_pages === 1
                  ? ""
                  : "s"}.

              </div>

            </section>

            {/* Compliance Score */}

            <section>

              <div className="mb-4 flex items-center gap-3">

                <div className="h-8 w-1 rounded-full bg-cyan-400" />

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Overall Assessment
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Compliance Score
                  </h2>

                </div>

              </div>

              <ComplianceScoreCard
                score={result.overall_score}
              />

            </section>

            {/* Compliance Items */}

            <section>

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Regulatory Requirements
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Compliance Checks
                  </h2>

                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">

                  <ShieldAlert className="h-4 w-4 text-amber-400" />

                  Review items marked for attention.

                </div>

              </div>

              <div className="space-y-3">

                {result.checks.map(
                  (item, index) => (

                    <div
                      key={`${item.title}-${index}`}
                    >

                      <ComplianceItem
                        title={item.title}
                        status={item.status}
                      />

                      {item.description && (

                        <div className="mt-1 rounded-b-2xl border-x border-b border-slate-800 bg-slate-950/30 px-5 py-3">

                          <p className="text-xs leading-5 text-slate-500">

                            {item.description}

                            {item.page && (

                              <span className="ml-2 font-medium text-slate-400">
                                Page {item.page}
                              </span>

                            )}

                          </p>

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            </section>

            {/* Recommendations */}

            <section>

              <div className="mb-5">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  AI Guidance
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Recommended Actions
                </h2>

              </div>

              <div className="space-y-3">

                {result.recommendations.length > 0 ? (

                  result.recommendations.map(
                    (recommendation, index) => (

                      <ComplianceSuggestion
                        key={index}
                        suggestion={recommendation}
                      />

                    )
                  )

                ) : (

                  <ComplianceSuggestion
                    suggestion={`No additional recommendations were returned for ${regulation}.`}
                  />

                )}

              </div>

            </section>

          </>

        )}

      </div>

    </main>
  );
}

export default CompliancePage;