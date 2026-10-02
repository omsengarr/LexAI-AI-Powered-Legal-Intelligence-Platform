import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Trash2,
  Scale,
  Building2,
  FileText,
  CalendarDays,
  Hash,
  CheckCircle2,
  Clock3,
  XCircle,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

// ========================================
// Case Interface
// ========================================

interface LegalCase {
  id: number;
  case_number: string;
  title: string;
  court: string | null;
  case_type: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
}

// ========================================
// Case Details Page
// ========================================

function CaseDetailsPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  // ========================================
  // State
  // ========================================

  const [legalCase, setLegalCase] =
    useState<LegalCase | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  // ========================================
  // Load Case
  // ========================================

  useEffect(() => {
    async function fetchCase() {
      try {
        setLoading(true);
        setError("");

        if (!caseId) {
          throw new Error(
            "Case ID is missing."
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/cases/${caseId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "Case not found."
            );
          }

          throw new Error(
            "Failed to load case details."
          );
        }

        const data: LegalCase =
          await response.json();

        setLegalCase(data);
      } catch (error) {
        console.error(
          "Failed to fetch case:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load case details."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCase();
  }, [caseId]);

  // ========================================
  // Delete Case
  // ========================================

  const handleDeleteCase = async () => {
    if (!caseId) {
      setDeleteError(
        "Case ID is missing."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this case? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await fetch(
        `${API_BASE_URL}/cases/${caseId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to delete case."
        );
      }

      navigate("/cases");
    } catch (error) {
      console.error(
        "Failed to delete case:",
        error
      );

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete case."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ========================================
  // Status Helper
  // ========================================

  const getStatusInfo = (
    caseStatus: string | null
  ) => {
    const normalized =
      caseStatus?.toLowerCase();

    if (normalized === "closed") {
      return {
        icon: XCircle,
        wrapper:
          "border-slate-700 bg-slate-800/70 text-slate-400",
        iconClass: "text-slate-500",
      };
    }

    if (normalized === "pending") {
      return {
        icon: Clock3,
        wrapper:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
        iconClass: "text-amber-400",
      };
    }

    return {
      icon: CheckCircle2,
      wrapper:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      iconClass: "text-emerald-400",
    };
  };

  // ========================================
  // Format Date
  // ========================================

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "Unknown date";
    }
  };

  // ========================================
  // Loading
  // ========================================

  if (loading) {
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
              Loading case details
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Retrieving case information...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // Error
  // ========================================

  if (error || !legalCase) {
    return (
      <main className="relative min-h-full space-y-8 pb-8">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-3xl" />

          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-red-500/[0.03] blur-3xl" />
        </div>

        <div className="relative z-10">
          <button
            type="button"
            onClick={() =>
              navigate("/cases")
            }
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-slate-900/60 px-4 py-2.5 text-sm text-slate-400 backdrop-blur-xl transition hover:border-white/[0.12] hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            Back to Case Search
          </button>

          <section className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-7 shadow-xl shadow-black/10">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                <AlertCircle size={21} />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-white">
                  Unable to load case
                </h1>

                <p className="mt-1 text-sm leading-6 text-red-300/80">
                  {error ||
                    "Case not found."}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/cases")
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
                >
                  Return to Cases

                  <ArrowUpRight
                    size={14}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ========================================
  // Status
  // ========================================

  const statusInfo = getStatusInfo(
    legalCase.status
  );

  const StatusIcon = statusInfo.icon;

  // ========================================
  // Case Details
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
            Back Navigation
        ======================================== */}

        <button
          type="button"
          onClick={() =>
            navigate("/cases")
          }
          className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-slate-900/60 px-4 py-2.5 text-sm text-slate-400 backdrop-blur-xl transition hover:border-white/[0.12] hover:bg-slate-900 hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-0.5"
          />

          Back to Case Search
        </button>

        {/* ========================================
            Case Hero
        ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/70 p-6 shadow-2xl shadow-black/15 backdrop-blur-xl sm:p-8">
          {/* Glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-3xl" />

          <div className="relative">
            {/* Badge Row */}

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-cyan-300">
                <Scale size={13} />

                {legalCase.case_number}
              </span>

              {legalCase.status && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium ${statusInfo.wrapper}`}
                >
                  <StatusIcon
                    size={13}
                  />

                  {legalCase.status}
                </span>
              )}
            </div>

            {/* Title */}

            <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              {legalCase.title}
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Case overview and legal information
            </p>

            {/* Hero Metadata */}

            <div className="mt-7 flex flex-wrap gap-3">
              {legalCase.court && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-slate-950/50 px-4 py-2.5">
                  <Building2
                    size={15}
                    className="text-cyan-400"
                  />

                  <span className="text-xs text-slate-400">
                    {legalCase.court}
                  </span>
                </div>
              )}

              {legalCase.case_type && (
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-slate-950/50 px-4 py-2.5">
                  <FileText
                    size={15}
                    className="text-cyan-400"
                  />

                  <span className="text-xs text-slate-400">
                    {legalCase.case_type}
                  </span>
                </div>
              )}

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-slate-950/50 px-4 py-2.5">
                <CalendarDays
                  size={15}
                  className="text-cyan-400"
                />

                <span className="text-xs text-slate-400">
                  {formatDate(
                    legalCase.created_at
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            Overview Cards
        ======================================== */}

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Court */}

          <div className="group rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:border-cyan-400/15">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.07] text-cyan-400">
                <Building2 size={18} />
              </div>

              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Court
              </span>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Jurisdiction
            </p>

            <p className="mt-1.5 text-base font-semibold leading-6 text-white">
              {legalCase.court ||
                "Not specified"}
            </p>
          </div>

          {/* Case Type */}

          <div className="group rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:border-cyan-400/15">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.07] text-cyan-400">
                <FileText size={18} />
              </div>

              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Type
              </span>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Classification
            </p>

            <p className="mt-1.5 text-base font-semibold leading-6 text-white">
              {legalCase.case_type ||
                "Not specified"}
            </p>
          </div>

          {/* Status */}

          <div className="group rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:border-cyan-400/15">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.07] text-cyan-400">
                <StatusIcon size={18} />
              </div>

              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Status
              </span>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Current State
            </p>

            <p className="mt-1.5 text-base font-semibold leading-6 text-white">
              {legalCase.status ||
                "Not specified"}
            </p>
          </div>
        </section>

        {/* ========================================
            Main Content
        ======================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Description */}

          <section className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.07] text-cyan-400">
                <Scale size={18} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Case Description
                </h2>

                <p className="mt-0.5 text-xs text-slate-600">
                  Overview provided for this case
                </p>
              </div>
            </div>

            <div className="mt-7 border-t border-white/[0.06] pt-6">
              {legalCase.description ? (
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {legalCase.description}
                </p>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-slate-950/30 p-6 text-center">
                  <p className="text-sm text-slate-500">
                    No description available
                    for this case.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Case Metadata */}

          <section className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.07] text-cyan-400">
                <Hash size={18} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Case Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-600">
                  Record metadata
                </p>
              </div>
            </div>

            <div className="mt-6 divide-y divide-white/[0.06]">
              {/* Case ID */}

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs text-slate-500">
                  Case ID
                </span>

                <span className="text-right text-sm font-medium text-slate-300">
                  {legalCase.id}
                </span>
              </div>

              {/* Case Number */}

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs text-slate-500">
                  Case Number
                </span>

                <span className="max-w-[190px] text-right text-sm font-medium text-slate-300">
                  {legalCase.case_number}
                </span>
              </div>

              {/* Status */}

              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs text-slate-500">
                  Status
                </span>

                <span className="text-right text-sm font-medium text-slate-300">
                  {legalCase.status ||
                    "Not specified"}
                </span>
              </div>

              {/* Created */}

              <div className="flex items-start justify-between gap-4 py-4">
                <span className="text-xs text-slate-500">
                  Created
                </span>

                <span className="max-w-[190px] text-right text-sm font-medium leading-5 text-slate-300">
                  {formatDate(
                    legalCase.created_at
                  )}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================
            Delete Error
        ======================================== */}

        {deleteError && (
          <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-5 shadow-xl shadow-black/10">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <p className="text-sm font-medium text-red-300">
                  Unable to delete case
                </p>

                <p className="mt-1 text-xs leading-5 text-red-300/70">
                  {deleteError}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ========================================
            Danger Zone
        ======================================== */}

        <section className="overflow-hidden rounded-3xl border border-red-400/15 bg-slate-900/60 shadow-xl shadow-black/10 backdrop-blur-xl">
          <div className="border-b border-red-400/10 bg-red-400/[0.025] px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                <ShieldAlert size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-white">
                  Danger Zone
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Destructive case management actions
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-slate-300">
                Delete this case
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Permanently remove this case from
                the LexAI database. This action
                cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDeleteCase}
              disabled={deleting}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-5 py-3 text-sm font-semibold text-red-300 transition hover:border-red-400/30 hover:bg-red-500/[0.14] hover:text-red-200 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
            >
              {deleting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={17} />

                  Delete Case
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CaseDetailsPage;