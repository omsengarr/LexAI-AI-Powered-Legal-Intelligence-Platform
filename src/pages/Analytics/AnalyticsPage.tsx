import { useEffect, useState } from "react";

import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  FileText,
  MessageSquare,
  Scale,
  Server,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { API_BASE_URL } from "../../services/api";
import AnalyticsCard from "../../components/analytics/AnalyticsCard";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";

function AnalyticsPage() {
  // ========================================
  // Analytics Statistics
  // ========================================

  const [documentCount, setDocumentCount] = useState(0);
  const [aiQueryCount, setAIQueryCount] = useState(0);
  const [caseCount, setCaseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ========================================
  // Load Analytics Data
  // ========================================

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // ----------------------------------------
        // Documents
        // ----------------------------------------

        const documentResponse = await fetch(
          `${API_BASE_URL}/documents/count`
        );

        if (!documentResponse.ok) {
          throw new Error("Failed to fetch document count");
        }

        const documentData = await documentResponse.json();

        setDocumentCount(documentData.count);

        // ----------------------------------------
        // AI Queries
        // ----------------------------------------

        const queryResponse = await fetch(
          `${API_BASE_URL}/queries/count`
        );

        if (!queryResponse.ok) {
          throw new Error("Failed to fetch AI query count");
        }

        const queryData = await queryResponse.json();

        setAIQueryCount(queryData.count);

        // ----------------------------------------
        // Cases
        // ----------------------------------------

        const caseResponse = await fetch(
          `${API_BASE_URL}/cases/count`
        );

        if (!caseResponse.ok) {
          throw new Error("Failed to fetch case count");
        }

        const caseData = await caseResponse.json();

        setCaseCount(caseData.count);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // ========================================
  // Loading State
  // ========================================

  if (loading) {
    return (
      <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex min-h-[500px] items-center justify-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-8 py-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Activity className="h-5 w-5 animate-pulse text-cyan-300" />
              </div>

              <div>
                <p className="font-semibold text-white">
                  Loading analytics
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Fetching your latest platform activity...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // Analytics UI
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
            PAGE HEADER
        ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.05]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                <BarChart3 className="h-3.5 w-3.5" />
                Legal Intelligence Analytics
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Analytics
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Monitor your legal intelligence platform activity,
                document processing, AI usage, and case intelligence
                from one workspace.
              </p>
            </div>

            {/* System status */}
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Server className="h-5 w-5 text-emerald-300" />

                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Platform Status
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  System Active
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            ANALYTICS STATISTICS
        ======================================== */}

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Platform Metrics
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Activity Overview
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Live backend statistics
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <AnalyticsCard
              title="Documents Processed"
              value={documentCount.toString()}
              icon={<FileText />}
            />

            <AnalyticsCard
              title="AI Queries"
              value={aiQueryCount.toString()}
              icon={<MessageSquare />}
            />

            <AnalyticsCard
              title="Legal Cases"
              value={caseCount.toString()}
              icon={<Scale />}
            />

            <AnalyticsCard
              title="System Activity"
              value="Active"
              icon={<Activity />}
            />
          </div>
        </section>

        {/* ========================================
            ANALYTICS CHARTS
        ======================================== */}

        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Usage Intelligence
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Platform Activity
            </h2>
          </div>

          <AnalyticsCharts />
        </section>

        {/* ========================================
            PLATFORM INSIGHTS
        ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-purple-500/[0.03]" />

          <div className="relative">
            {/* Section heading */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                  <Sparkles className="h-5 w-5 text-cyan-300" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Platform Insights
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Current activity overview across LexAI.
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Operational
              </div>
            </div>

            {/* Insight Cards */}

            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Document Insight */}

              <div className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-slate-950/80">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                    <FileText className="h-5 w-5 text-cyan-300" />
                  </div>

                  <span className="text-xs font-medium text-slate-600">
                    DATA
                  </span>
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Document Processing
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {documentCount}
                  <span className="ml-1.5 text-sm font-medium text-slate-500">
                    Documents
                  </span>
                </p>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  Documents currently tracked by LexAI.
                </p>
              </div>

              {/* AI Insight */}

              <div className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-slate-950/80">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    <Brain className="h-5 w-5 text-purple-300" />
                  </div>

                  <span className="text-xs font-medium text-slate-600">
                    AI
                  </span>
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  AI Assistant
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {aiQueryCount}
                  <span className="ml-1.5 text-sm font-medium text-slate-500">
                    Queries
                  </span>
                </p>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  AI queries recorded by the backend.
                </p>
              </div>

              {/* Case Insight */}

              <div className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-950/80">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                    <Scale className="h-5 w-5 text-blue-300" />
                  </div>

                  <span className="text-xs font-medium text-slate-600">
                    CASES
                  </span>
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Case Intelligence
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {caseCount}
                  <span className="ml-1.5 text-sm font-medium text-slate-500">
                    Cases
                  </span>
                </p>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  Legal cases currently available for analysis.
                </p>
              </div>
            </div>

            {/* Bottom intelligence strip */}

            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Activity className="h-4 w-4 text-cyan-300" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-300">
                    LexAI intelligence systems are active
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Statistics are retrieved from the connected backend.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Operational
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AnalyticsPage;