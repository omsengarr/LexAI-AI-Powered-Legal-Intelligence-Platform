import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import { compareCases } from "../../services/api";
import {
  ArrowLeftRight,
  CheckCircle2,
  FileText,
  Gavel,
  Search,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface CaseItem {
  id: number;
  case_number: string;
  title: string;
  court: string | null;
  case_type: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
}

interface ComparisonDifference {
  category: string;
  case1: string;
  case2: string;
}

interface ComparisonResult {
  overview: string;
  similarities: string[];
  differences: ComparisonDifference[];
  observations: string[];
}

function JudgmentComparisonPage() {
  // ========================================
  // State
  // ========================================

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [leftCaseId, setLeftCaseId] = useState<number | null>(null);
  const [rightCaseId, setRightCaseId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);

  const [comparisonLoading, setComparisonLoading] =
    useState(false);

  const [comparisonError, setComparisonError] =
    useState("");

  // ========================================
  // Fetch Cases
  // ========================================

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/cases`);

        if (!response.ok) {
          throw new Error("Failed to fetch cases");
        }

        const data = await response.json();

        setCases(data);
      } catch (err) {
        console.error("Failed to load cases:", err);

        setError(
          "Unable to load cases. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // ========================================
  // Search
  // ========================================

  const filteredCases = cases.filter((item) => {
    const searchableText = `
      ${item.case_number}
      ${item.title}
      ${item.court ?? ""}
      ${item.case_type ?? ""}
      ${item.description ?? ""}
    `.toLowerCase();

    return searchableText.includes(
      searchQuery.toLowerCase()
    );
  });

  // ========================================
  // Selected Cases
  // ========================================

  const leftCase =
    cases.find(
      (item) => item.id === leftCaseId
    ) ?? null;

  const rightCase =
    cases.find(
      (item) => item.id === rightCaseId
    ) ?? null;

  // ========================================
  // AI Comparison
  // ========================================

  const handleCompareCases = async () => {
    if (!leftCaseId || !rightCaseId) {
      setComparisonError(
        "Please select two cases before starting the comparison."
      );
      return;
    }

    if (leftCaseId === rightCaseId) {
      setComparisonError(
        "Please select two different cases."
      );
      return;
    }

    try {
      setComparisonLoading(true);
      setComparisonError("");
      setComparisonResult(null);

      const result = await compareCases(
        leftCaseId,
        rightCaseId
      );

      setComparisonResult(result.comparison);
    } catch (err) {
      console.error(
        "Case comparison failed:",
        err
      );

      setComparisonError(
        err instanceof Error
          ? err.message
          : "Unable to compare the selected cases."
      );
    } finally {
      setComparisonLoading(false);
    }
  };

  // ========================================
  // Helpers
  // ========================================

  const getStatusClass = (
    status: string | null
  ) => {
    const normalized = (
      status ?? ""
    ).toLowerCase();

    if (
      normalized.includes("active") ||
      normalized.includes("open")
    ) {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    }

    if (
      normalized.includes("closed") ||
      normalized.includes("resolved")
    ) {
      return "border-slate-700 bg-slate-800/80 text-slate-300";
    }

    if (
      normalized.includes("pending") ||
      normalized.includes("review")
    ) {
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    }

    return "border-slate-700 bg-slate-800/80 text-slate-300";
  };

  const formatDate = (date: string) => {
    if (!date) return "Not available";

    const normalized = date.endsWith("Z")
      ? date
      : `${date}Z`;

    const parsedDate = new Date(normalized);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================
  // Render
  // ========================================

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ========================================
          AMBIENT BACKGROUND
      ======================================== */}

      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10 space-y-8">

        {/* ========================================
            HEADER
        ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.05]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                <Scale className="h-3.5 w-3.5" />
                Legal Intelligence Comparison
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Judgment Comparison
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Compare two legal cases side by side and use
                AI to identify similarities, differences, and
                important observations.
              </p>
            </div>

            {/* Comparison Engine */}

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <ArrowLeftRight className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Comparison Engine
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Ready
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            SEARCH
        ======================================== */}

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-xl sm:p-6">

          <div className="mb-4 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <Search className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Find a Case
                </h2>

                <p className="text-xs text-slate-500">
                  Search your available legal cases.
                </p>
              </div>

            </div>

            <div className="hidden rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-500 sm:block">
              {filteredCases.length}{" "}
              {filteredCases.length === 1
                ? "case"
                : "cases"}{" "}
              found
            </div>

          </div>

          <div className="relative">

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search by title, case number, court..."
              className="
                w-full
                rounded-2xl
                border
                border-slate-700
                bg-slate-950/80
                px-5
                py-4
                pr-12
                text-sm
                text-white
                placeholder:text-slate-600
                outline-none
                transition
                hover:border-slate-600
                focus:border-cyan-500/60
                focus:ring-2
                focus:ring-cyan-500/10
              "
            />

            <Search
              size={19}
              className="
                pointer-events-none
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

          </div>

        </section>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5 text-red-300">

            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <ShieldCheck className="h-4 w-4 text-red-300" />
            </div>

            <div>
              <p className="font-semibold">
                Unable to load cases
              </p>

              <p className="mt-1 text-sm text-red-300/70">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* ========================================
            LOADING
        ======================================== */}

        {loading ? (

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-12 text-center shadow-xl backdrop-blur-xl">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
              <Scale className="h-5 w-5 animate-pulse text-cyan-300" />
            </div>

            <p className="mt-5 font-semibold text-white">
              Loading legal cases
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Preparing your comparison workspace...
            </p>

          </div>

        ) : (

          <>

            {/* ========================================
                CASE SELECTION
            ======================================== */}

            <section>

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <FileText className="h-5 w-5 text-cyan-300" />

                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Case Library
                    </p>

                  </div>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Select Cases
                  </h2>

                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">

                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
                    {leftCase ? "1" : "—"}
                  </span>

                  <ArrowLeftRight className="h-3.5 w-3.5" />

                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300">
                    {rightCase ? "2" : "—"}
                  </span>

                </div>

              </div>

              {filteredCases.length === 0 ? (

                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-xl backdrop-blur-xl">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/70">
                    <Search className="h-5 w-5 text-slate-500" />
                  </div>

                  <h3 className="mt-5 font-semibold text-white">
                    No cases found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Try a different title, case number,
                    court, or keyword.
                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                  {filteredCases.map((item) => {

                    const selectedLeft =
                      leftCaseId === item.id;

                    const selectedRight =
                      rightCaseId === item.id;

                    return (

                      <div
                        key={item.id}
                        className={`
                          group
                          relative
                          overflow-hidden
                          rounded-3xl
                          border
                          bg-slate-900/70
                          p-6
                          shadow-xl
                          backdrop-blur-xl
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          ${
                            selectedLeft ||
                            selectedRight
                              ? "border-cyan-500/30"
                              : "border-slate-800 hover:border-slate-700"
                          }
                        `}
                      >

                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-cyan-500/[0.02]" />

                        <div className="relative">

                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
                                {item.case_number}
                              </p>

                              <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-6 text-white">
                                {item.title}
                              </h3>

                            </div>

                            <span
                              className={`
                                shrink-0
                                rounded-full
                                border
                                px-3
                                py-1.5
                                text-[11px]
                                font-medium
                                ${getStatusClass(
                                  item.status
                                )}
                              `}
                            >
                              {item.status ??
                                "Unknown"}
                            </span>

                          </div>

                          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">

                              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                Court
                              </p>

                              <p className="mt-2 text-sm text-slate-300">
                                {item.court ??
                                  "Not available"}
                              </p>

                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">

                              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                Case Type
                              </p>

                              <p className="mt-2 text-sm text-slate-300">
                                {item.case_type ??
                                  "Not available"}
                              </p>

                            </div>

                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-4">

                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Gavel className="h-3.5 w-3.5" />
                              Added{" "}
                              {formatDate(
                                item.created_at
                              )}
                            </div>

                          </div>

                          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                            <button
                              type="button"
                              onClick={() => {
                                setLeftCaseId(
                                  item.id
                                );
                                setComparisonResult(
                                  null
                                );
                                setComparisonError(
                                  ""
                                );
                              }}
                              className={`
                                rounded-2xl
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                transition-all
                                ${
                                  selectedLeft
                                    ? "border border-cyan-400/30 bg-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                                    : "border border-slate-700 bg-slate-800/70 text-slate-300 hover:border-cyan-500/30 hover:bg-slate-800 hover:text-white"
                                }
                              `}
                            >
                              {selectedLeft ? (

                                <span className="flex items-center justify-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Selected as Case 1
                                </span>

                              ) : (

                                "Select Case 1"

                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRightCaseId(
                                  item.id
                                );
                                setComparisonResult(
                                  null
                                );
                                setComparisonError(
                                  ""
                                );
                              }}
                              className={`
                                rounded-2xl
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                transition-all
                                ${
                                  selectedRight
                                    ? "border border-purple-400/30 bg-purple-500/80 text-white shadow-lg shadow-purple-500/10"
                                    : "border border-slate-700 bg-slate-800/70 text-slate-300 hover:border-purple-500/30 hover:bg-slate-800 hover:text-white"
                                }
                              `}
                            >
                              {selectedRight ? (

                                <span className="flex items-center justify-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Selected as Case 2
                                </span>

                              ) : (

                                "Select Case 2"

                              )}
                            </button>

                          </div>

                        </div>

                      </div>

                    );
                  })}

                </div>

              )}

            </section>

            {/* ========================================
                COMPARISON WORKSPACE
            ======================================== */}

            <section>

              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <ArrowLeftRight className="h-5 w-5 text-cyan-300" />

                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Analysis Workspace
                    </p>

                  </div>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Case Comparison
                  </h2>

                </div>

                {leftCase && rightCase && (

                  <button
                    type="button"
                    onClick={
                      handleCompareCases
                    }
                    disabled={
                      comparisonLoading
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border
                      border-cyan-400/20
                      bg-cyan-500/10
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-cyan-300
                      transition
                      hover:border-cyan-400/40
                      hover:bg-cyan-500/20
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {comparisonLoading ? (

                      <>
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        Comparing...
                      </>

                    ) : (

                      <>
                        <ArrowLeftRight className="h-4 w-4" />
                        Compare Cases
                      </>

                    )}

                  </button>

                )}

              </div>

              {/* ========================================
                  COMPARISON ERROR
              ======================================== */}

              {comparisonError && (

                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5 text-red-300">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                    <ShieldCheck className="h-4 w-4 text-red-300" />
                  </div>

                  <div>

                    <p className="font-semibold">
                      Comparison failed
                    </p>

                    <p className="mt-1 text-sm text-red-300/70">
                      {comparisonError}
                    </p>

                  </div>

                </div>

              )}

              {!leftCase || !rightCase ? (

                <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-xl backdrop-blur-xl sm:p-14">

                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-purple-500/[0.03]" />

                  <div className="relative">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/70">
                      <ArrowLeftRight className="h-7 w-7 text-slate-600" />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-white">
                      Select two cases to compare
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Choose Case 1 and Case 2 above to
                      unlock the side-by-side legal
                      comparison workspace.
                    </p>

                    <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-4 py-2 text-xs text-cyan-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Select both cases to continue
                    </div>

                  </div>

                </div>

              ) : (

                <>

                  {/* ========================================
                      SELECTED CASES
                  ======================================== */}

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {/* ========================================
                        CASE 1
                    ======================================== */}

                    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl">

                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-transparent" />

                      <div className="relative">

                        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-sm font-bold text-cyan-300">
                              01
                            </div>

                            <div>

                              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
                                Case 1
                              </p>

                              <h3 className="mt-1 max-w-sm text-lg font-semibold text-white">
                                {leftCase.title}
                              </h3>

                            </div>

                          </div>

                          <Scale className="h-5 w-5 shrink-0 text-cyan-400/60" />

                        </div>

                        <div className="mt-6 space-y-5">

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Case Number
                            </p>

                            <p className="mt-2 text-sm font-medium text-slate-200">
                              {leftCase.case_number}
                            </p>

                          </div>

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Court
                            </p>

                            <p className="mt-2 text-sm text-slate-300">
                              {leftCase.court ??
                                "Not available"}
                            </p>

                          </div>

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Case Type
                            </p>

                            <p className="mt-2 text-sm text-slate-300">
                              {leftCase.case_type ??
                                "Not available"}
                            </p>

                          </div>

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Status
                            </p>

                            <span
                              className={`
                                mt-2
                                inline-flex
                                rounded-full
                                border
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                ${getStatusClass(
                                  leftCase.status
                                )}
                              `}
                            >
                              {leftCase.status ??
                                "Not available"}
                            </span>

                          </div>

                          <div className="border-t border-slate-800 pt-5">

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Description
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {leftCase.description ??
                                "No description available."}
                            </p>

                          </div>

                          <div className="border-t border-slate-800 pt-5">

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Added
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                              {formatDate(
                                leftCase.created_at
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* ========================================
                        CASE 2
                    ======================================== */}

                    <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl">

                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-transparent" />

                      <div className="relative">

                        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-sm font-bold text-purple-300">
                              02
                            </div>

                            <div>

                              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-purple-300">
                                Case 2
                              </p>

                              <h3 className="mt-1 max-w-sm text-lg font-semibold text-white">
                                {rightCase.title}
                              </h3>

                            </div>

                          </div>

                          <Scale className="h-5 w-5 shrink-0 text-purple-400/60" />

                        </div>

                        <div className="mt-6 space-y-5">

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Case Number
                            </p>

                            <p className="mt-2 text-sm font-medium text-slate-200">
                              {rightCase.case_number}
                            </p>

                          </div>

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Court
                            </p>

                            <p className="mt-2 text-sm text-slate-300">
                              {rightCase.court ??
                                "Not available"}
                            </p>

                          </div>

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Case Type
                            </p>

                            <p className="mt-2 text-sm text-slate-300">
                              {rightCase.case_type ??
                                "Not available"}
                            </p>

                          </div>

                          <div>

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Status
                            </p>

                            <span
                              className={`
                                mt-2
                                inline-flex
                                rounded-full
                                border
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                ${getStatusClass(
                                  rightCase.status
                                )}
                              `}
                            >
                              {rightCase.status ??
                                "Not available"}
                            </span>

                          </div>

                          <div className="border-t border-slate-800 pt-5">

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Description
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {rightCase.description ??
                                "No description available."}
                            </p>

                          </div>

                          <div className="border-t border-slate-800 pt-5">

                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                              Added
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                              {formatDate(
                                rightCase.created_at
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ========================================
                      AI COMPARISON LOADING
                  ======================================== */}

                  {comparisonLoading && (

                    <div className="mt-8 rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-10 text-center shadow-xl backdrop-blur-xl">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">

                        <Sparkles className="h-6 w-6 animate-pulse text-cyan-300" />

                      </div>

                      <h3 className="mt-5 text-lg font-semibold text-white">
                        AI is comparing the cases
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        LexAI is analyzing the available
                        case information and identifying
                        similarities and differences.
                      </p>

                    </div>

                  )}

                  {/* ========================================
                      AI COMPARISON RESULT
                  ======================================== */}

                  {comparisonResult && !comparisonLoading && (

                    <div className="mt-8 space-y-6">

                      {/* Overview */}

                      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">

                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-purple-500/[0.03]" />

                        <div className="relative">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">

                              <Sparkles className="h-5 w-5 text-cyan-300" />

                            </div>

                            <div>

                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                                AI Analysis
                              </p>

                              <h2 className="mt-1 text-xl font-semibold text-white">
                                Comparison Overview
                              </h2>

                            </div>

                          </div>

                          <p className="mt-6 text-sm leading-7 text-slate-300">
                            {comparisonResult.overview}
                          </p>

                        </div>

                      </div>

                      {/* Similarities */}

                      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">

                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-transparent" />

                        <div className="relative">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">

                              <CheckCircle2 className="h-5 w-5 text-emerald-300" />

                            </div>

                            <div>

                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                                Common Ground
                              </p>

                              <h2 className="mt-1 text-xl font-semibold text-white">
                                Similarities
                              </h2>

                            </div>

                          </div>

                          {comparisonResult.similarities.length === 0 ? (

                            <p className="mt-6 text-sm text-slate-500">
                              No clear similarities could
                              be identified from the stored
                              case information.
                            </p>

                          ) : (

                            <div className="mt-6 space-y-3">

                              {comparisonResult.similarities.map(
                                (similarity, index) => (

                                  <div
                                    key={`${similarity}-${index}`}
                                    className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
                                  >

                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-semibold text-emerald-300">
                                      {index + 1}
                                    </span>

                                    <p className="text-sm leading-6 text-slate-300">
                                      {similarity}
                                    </p>

                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </div>

                      </div>

                      {/* Differences */}

                      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">

                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.04] via-transparent to-transparent" />

                        <div className="relative">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">

                              <ArrowLeftRight className="h-5 w-5 text-purple-300" />

                            </div>

                            <div>

                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">
                                Side-by-Side Analysis
                              </p>

                              <h2 className="mt-1 text-xl font-semibold text-white">
                                Key Differences
                              </h2>

                            </div>

                          </div>

                          {comparisonResult.differences.length === 0 ? (

                            <p className="mt-6 text-sm text-slate-500">
                              No significant differences could
                              be identified from the stored
                              case information.
                            </p>

                          ) : (

                            <div className="mt-6 space-y-4">

                              {comparisonResult.differences.map(
                                (difference, index) => (

                                  <div
                                    key={`${difference.category}-${index}`}
                                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50"
                                  >

                                    <div className="border-b border-slate-800 bg-slate-950/70 px-5 py-3">

                                      <p className="text-sm font-semibold text-white">
                                        {difference.category}
                                      </p>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2">

                                      <div className="border-b border-slate-800 p-5 md:border-b-0 md:border-r">

                                        <div className="mb-2 flex items-center gap-2">

                                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-[10px] font-bold text-cyan-300">
                                            01
                                          </span>

                                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">
                                            Case 1
                                          </p>

                                        </div>

                                        <p className="text-sm leading-6 text-slate-300">
                                          {difference.case1}
                                        </p>

                                      </div>

                                      <div className="p-5">

                                        <div className="mb-2 flex items-center gap-2">

                                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-[10px] font-bold text-purple-300">
                                            02
                                          </span>

                                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-300">
                                            Case 2
                                          </p>

                                        </div>

                                        <p className="text-sm leading-6 text-slate-300">
                                          {difference.case2}
                                        </p>

                                      </div>

                                    </div>

                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </div>

                      </div>

                      {/* Observations */}

                      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">

                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-transparent" />

                        <div className="relative">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">

                              <Gavel className="h-5 w-5 text-amber-300" />

                            </div>

                            <div>

                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                                AI Insights
                              </p>

                              <h2 className="mt-1 text-xl font-semibold text-white">
                                Important Observations
                              </h2>

                            </div>

                          </div>

                          {comparisonResult.observations.length === 0 ? (

                            <p className="mt-6 text-sm text-slate-500">
                              No additional observations could
                              be generated from the available
                              information.
                            </p>

                          ) : (

                            <div className="mt-6 space-y-3">

                              {comparisonResult.observations.map(
                                (observation, index) => (

                                  <div
                                    key={`${observation}-${index}`}
                                    className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
                                  >

                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-semibold text-amber-300">
                                      {index + 1}
                                    </span>

                                    <p className="text-sm leading-6 text-slate-300">
                                      {observation}
                                    </p>

                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </div>

                      </div>

                      {/* Disclaimer */}

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

                        <div className="flex items-start gap-3">

                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                          <p className="text-xs leading-5 text-slate-500">
                            This AI comparison is based only
                            on the information stored in the
                            selected case records. It is provided
                            for legal research and informational
                            purposes and should not be treated
                            as a definitive legal opinion.
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                </>

              )}

            </section>

          </>

        )}

      </div>
    </main>
  );
}

export default JudgmentComparisonPage;
