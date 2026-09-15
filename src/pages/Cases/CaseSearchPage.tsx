import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Loader2,
  AlertCircle,
  Plus,
  X,
  Scale,
  Building2,
  FileText,
  ArrowUpRight,
  SlidersHorizontal,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  XCircle,
  CalendarDays,
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
// Case Search Page
// ========================================

function CaseSearchPage() {
  const navigate = useNavigate();

  // ========================================
  // State
  // ========================================

  const [cases, setCases] = useState<LegalCase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // ========================================
  // New Case Form State
  // ========================================

  const [caseNumber, setCaseNumber] = useState("");
  const [title, setTitle] = useState("");
  const [court, setCourt] = useState("");
  const [caseType, setCaseType] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  // ========================================
  // Load Cases
  // ========================================

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/cases"
      );

      if (!response.ok) {
        throw new Error("Failed to load cases.");
      }

      const data: LegalCase[] = await response.json();

      setCases(data);
    } catch (error) {
      console.error("Failed to fetch cases:", error);

      setError(
        "Unable to load cases. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // ========================================
  // Open Create Form
  // ========================================

  const openCreateForm = () => {
    setShowCreateForm(true);
    setCreateError("");
    setCreateSuccess("");
  };

  // ========================================
  // Close Create Form
  // ========================================

  const closeCreateForm = () => {
    if (creating) return;

    setShowCreateForm(false);
    setCreateError("");
    setCreateSuccess("");
  };

  // ========================================
  // Create New Case
  // ========================================

  const handleCreateCase = async (event: FormEvent) => {
    event.preventDefault();

    setCreateError("");
    setCreateSuccess("");

    if (!caseNumber.trim() || !title.trim()) {
      setCreateError(
        "Case number and title are required."
      );

      return;
    }

    try {
      setCreating(true);

      const params = new URLSearchParams();

      params.append(
        "case_number",
        caseNumber.trim()
      );

      params.append(
        "title",
        title.trim()
      );

      params.append(
        "court",
        court.trim()
      );

      params.append(
        "case_type",
        caseType.trim()
      );

      params.append(
        "description",
        description.trim()
      );

      params.append(
        "status",
        status
      );

      const response = await fetch(
        `http://127.0.0.1:8000/cases?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create case."
        );
      }

      setCreateSuccess(
        "Case created successfully."
      );

      // Clear form

      setCaseNumber("");
      setTitle("");
      setCourt("");
      setCaseType("");
      setDescription("");
      setStatus("Active");

      // Reload cases

      await fetchCases();

      // Close form after short delay

      setTimeout(() => {
        setShowCreateForm(false);
        setCreateSuccess("");
      }, 1200);
    } catch (error) {
      console.error(
        "Failed to create case:",
        error
      );

      setCreateError(
        error instanceof Error
          ? error.message
          : "Failed to create case."
      );
    } finally {
      setCreating(false);
    }
  };

  // ========================================
  // Search Cases
  // ========================================

  const filteredCases = cases.filter((item) => {
    const searchText =
      `${item.case_number}
      ${item.title}
      ${item.court ?? ""}
      ${item.case_type ?? ""}
      ${item.description ?? ""}
      ${item.status ?? ""}`.toLowerCase();

    return searchText.includes(
      searchQuery.toLowerCase()
    );
  });

  // ========================================
  // Status Helper
  // ========================================

  const getStatusStyles = (caseStatus: string | null) => {
    const normalizedStatus =
      caseStatus?.toLowerCase();

    if (normalizedStatus === "closed") {
      return {
        icon: XCircle,
        wrapper:
          "border-slate-700 bg-slate-800/70 text-slate-400",
      };
    }

    if (normalizedStatus === "pending") {
      return {
        icon: Clock3,
        wrapper:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };
    }

    return {
      icon: CheckCircle2,
      wrapper:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    };
  };

  // ========================================
  // Format Date
  // ========================================

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Unknown date";
    }
  };

  // ========================================
  // Page
  // ========================================

  return (
    <main className="relative min-h-full space-y-8 pb-8">
      {/* Ambient Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* ========================================
            Page Header
        ======================================== */}

        <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/60 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-medium text-cyan-300">
                <Scale size={14} />
                Legal Case Intelligence
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Case Search
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Search, review and explore your legal
                cases from one intelligent workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition-all duration-200 hover:bg-cyan-300 hover:shadow-cyan-400/20"
            >
              <Plus size={18} />

              Add New Case

              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* Overview Stats */}

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.06] bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Total Cases
                </span>

                <BriefcaseBusiness
                  size={16}
                  className="text-cyan-400"
                />
              </div>

              <p className="mt-2 text-2xl font-semibold text-white">
                {cases.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Active
                </span>

                <CheckCircle2
                  size={16}
                  className="text-emerald-400"
                />
              </div>

              <p className="mt-2 text-2xl font-semibold text-white">
                {
                  cases.filter(
                    (item) =>
                      item.status?.toLowerCase() ===
                      "active"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Pending
                </span>

                <Clock3
                  size={16}
                  className="text-amber-400"
                />
              </div>

              <p className="mt-2 text-2xl font-semibold text-white">
                {
                  cases.filter(
                    (item) =>
                      item.status?.toLowerCase() ===
                      "pending"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Closed
                </span>

                <XCircle
                  size={16}
                  className="text-slate-500"
                />
              </div>

              <p className="mt-2 text-2xl font-semibold text-white">
                {
                  cases.filter(
                    (item) =>
                      item.status?.toLowerCase() ===
                      "closed"
                  ).length
                }
              </p>
            </div>
          </div>
        </section>

        {/* ========================================
            Create Case Form
        ======================================== */}

        {showCreateForm && (
          <section className="overflow-hidden rounded-3xl border border-cyan-400/10 bg-slate-900/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
            {/* Form Header */}

            <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-6 sm:p-8">
              <div>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Plus size={18} />
                </div>

                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Create New Case
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a legal case to your LexAI
                  workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateForm}
                disabled={creating}
                className="rounded-xl border border-white/[0.06] bg-slate-800/70 p-2.5 text-slate-400 transition hover:border-white/[0.12] hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close create case form"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Create Error */}

              {createError && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <p className="text-sm leading-6 text-red-300">
                    {createError}
                  </p>
                </div>
              )}

              {/* Create Success */}

              {createSuccess && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-emerald-400"
                  />

                  <p className="text-sm text-emerald-300">
                    {createSuccess}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleCreateCase}
                className="space-y-6"
              >
                {/* Row 1 */}

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Case Number */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Case Number
                      <span className="ml-1 text-cyan-400">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={caseNumber}
                      onChange={(event) =>
                        setCaseNumber(
                          event.target.value
                        )
                      }
                      placeholder="LEX-2026-007"
                      className="w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/5"
                    />
                  </div>

                  {/* Title */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Case Title
                      <span className="ml-1 text-cyan-400">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(
                          event.target.value
                        )
                      }
                      placeholder="ABC Technologies vs XYZ Solutions"
                      className="w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/5"
                    />
                  </div>
                </div>

                {/* Row 2 */}

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Court */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Court
                    </label>

                    <div className="relative">
                      <Building2
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                      />

                      <input
                        type="text"
                        value={court}
                        onChange={(event) =>
                          setCourt(
                            event.target.value
                          )
                        }
                        placeholder="Delhi High Court"
                        className="w-full rounded-xl border border-white/[0.08] bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/5"
                      />
                    </div>
                  </div>

                  {/* Case Type */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Case Type
                    </label>

                    <div className="relative">
                      <FileText
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                      />

                      <input
                        type="text"
                        value={caseType}
                        onChange={(event) =>
                          setCaseType(
                            event.target.value
                          )
                        }
                        placeholder="Civil"
                        className="w-full rounded-xl border border-white/[0.08] bg-slate-950/70 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/5"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/5"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>

                {/* Description */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="Enter a brief description of the case..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/5"
                  />
                </div>

                {/* Buttons */}

                <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeCreateForm}
                    disabled={creating}
                    className="rounded-xl border border-white/[0.08] bg-slate-800/70 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/[0.12] hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  >
                    {creating ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={17} />

                        Create Case
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* ========================================
            Search Workspace
        ======================================== */}

        <section className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={17}
                  className="text-cyan-400"
                />

                <h2 className="text-sm font-semibold text-white">
                  Search Cases
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Search across case numbers, titles,
                courts and descriptions.
              </p>
            </div>

            <span className="text-xs text-slate-600">
              {filteredCases.length}{" "}
              {filteredCases.length === 1
                ? "result"
                : "results"}
            </span>
          </div>

          <div className="relative">
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search by case number, title, court or case type..."
              className="w-full rounded-2xl border border-white/[0.08] bg-slate-950/70 py-4 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/30 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-400/5"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery("")
                }
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </section>

        {/* ========================================
            Loading
        ======================================== */}

        {loading && (
          <section className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-12 text-center shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <Loader2
                size={22}
                className="animate-spin text-cyan-400"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-300">
              Loading legal cases
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Fetching your case workspace...
            </p>
          </section>
        )}

        {/* ========================================
            Error
        ======================================== */}

        {!loading && error && (
          <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-6 shadow-xl shadow-black/10">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400">
                <AlertCircle size={19} />
              </div>

              <div>
                <h3 className="font-medium text-white">
                  Unable to load cases
                </h3>

                <p className="mt-1 text-sm leading-6 text-red-300/80">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchCases}
                  className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/15"
                >
                  Try Again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ========================================
            Results
        ======================================== */}

        {!loading && !error && (
          <section className="space-y-5">
            {/* Results Header */}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Case Results
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Showing{" "}
                  <span className="text-slate-400">
                    {filteredCases.length}
                  </span>{" "}
                  {filteredCases.length === 1
                    ? "case"
                    : "cases"}
                </p>
              </div>

              {searchQuery && (
                <div className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-3 py-1.5 text-xs text-cyan-300">
                  Search: "{searchQuery}"
                </div>
              )}
            </div>

            {/* Case Cards */}

            {filteredCases.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {filteredCases.map((item) => {
                  const statusInfo =
                    getStatusStyles(
                      item.status
                    );

                  const StatusIcon =
                    statusInfo.icon;

                  return (
                    <article
                      key={item.id}
                      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/70 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-slate-900/90 sm:p-7"
                    >
                      {/* Card Glow */}

                      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-400/[0.04] blur-3xl transition-opacity duration-300 group-hover:bg-cyan-400/[0.08]" />

                      <div className="relative">
                        {/* Top Row */}

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-cyan-300">
                              <Scale size={12} />

                              {item.case_number}
                            </span>

                            {item.status && (
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium ${statusInfo.wrapper}`}
                              >
                                <StatusIcon
                                  size={12}
                                />

                                {item.status}
                              </span>
                            )}
                          </div>

                          <div className="hidden shrink-0 items-center gap-1 text-[11px] text-slate-600 sm:flex">
                            <CalendarDays
                              size={12}
                            />

                            {formatDate(
                              item.created_at
                            )}
                          </div>
                        </div>

                        {/* Title */}

                        <h2 className="mt-5 text-xl font-semibold leading-7 tracking-tight text-white transition group-hover:text-cyan-50 sm:text-2xl">
                          {item.title}
                        </h2>

                        {/* Metadata */}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.court && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-slate-950/50 px-3 py-2 text-xs text-slate-400">
                              <Building2
                                size={13}
                                className="text-slate-600"
                              />

                              {item.court}
                            </span>
                          )}

                          {item.case_type && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-slate-950/50 px-3 py-2 text-xs text-slate-400">
                              <FileText
                                size={13}
                                className="text-slate-600"
                              />

                              {item.case_type}
                            </span>
                          )}
                        </div>

                        {/* Description */}

                        {item.description && (
                          <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                            {item.description}
                          </p>
                        )}

                        {/* Bottom */}

                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-5">
                          <div className="flex items-center gap-2 text-xs text-slate-600 sm:hidden">
                            <CalendarDays
                              size={12}
                            />

                            {formatDate(
                              item.created_at
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/cases/${item.id}`
                              )
                            }
                            className="group/button ml-auto inline-flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-200"
                          >
                            View Details

                            <ArrowUpRight
                              size={15}
                              className="transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                            />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Empty State */

              <div className="rounded-3xl border border-white/[0.07] bg-slate-900/60 p-12 text-center shadow-xl shadow-black/10 backdrop-blur-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-slate-800/70 text-slate-500">
                  {searchQuery ? (
                    <Search size={22} />
                  ) : (
                    <BriefcaseBusiness
                      size={22}
                    />
                  )}
                </div>

                <h3 className="mt-5 text-base font-semibold text-white">
                  {searchQuery
                    ? "No matching cases"
                    : "No cases available"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {searchQuery
                    ? `No cases found for "${searchQuery}". Try a different search term.`
                    : "Create your first legal case to begin building your case workspace."}
                </p>

                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    className="mt-5 rounded-xl border border-white/[0.08] bg-slate-800/70 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    <Plus size={15} />

                    Add New Case
                  </button>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default CaseSearchPage;