import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import DashboardCard from "../../components/dashboard/DashboardCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";

import {
  healthCheck,
  getDocumentCount,
  getAIQueryCount,
} from "../../services/api";

import {
  FileText,
  Bot,
  Scale,
  AlertTriangle,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Search,
  Brain,
  Zap,
} from "lucide-react";

function DashboardPage() {
  // ========================================
  // Dashboard Statistics
  // ========================================

  const [documentCount, setDocumentCount] = useState(0);
  const [aiQueryCount, setAIQueryCount] = useState(0);
  const [caseCount, setCaseCount] = useState(0);

  // ========================================
  // Load Dashboard Data
  // ========================================

  useEffect(() => {
    // ----------------------------------------
    // Backend Health Check
    // ----------------------------------------

    healthCheck()
      .then((data) => {
        console.log("Backend connected:", data);
      })
      .catch((error) => {
        console.error("Backend connection failed:", error);
      });

    // ----------------------------------------
    // Get Document Count
    // ----------------------------------------

    getDocumentCount()
      .then((data) => {
        console.log("Document count:", data);

        setDocumentCount(data.count);
      })
      .catch((error) => {
        console.error("Failed to get document count:", error);
      });

    // ----------------------------------------
    // Get AI Query Count
    // ----------------------------------------

    getAIQueryCount()
      .then((data) => {
        console.log("AI query count:", data);

        setAIQueryCount(data.count);
      })
      .catch((error) => {
        console.error("Failed to get AI query count:", error);
      });

    // ----------------------------------------
    // Get Case Count
    // ----------------------------------------

    fetch(`${API_BASE_URL}/cases/count`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch case count");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Case count:", data);

        setCaseCount(data.count);
      })
      .catch((error) => {
        console.error("Failed to get case count:", error);
      });
  }, []);

  // ========================================
  // Dashboard UI
  // ========================================

  return (
    <div className="relative space-y-8 pb-6">
      {/* ========================================
          Ambient Background
      ======================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[18%] top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/[0.035] blur-[120px]" />

        <div className="absolute right-[8%] top-[30%] h-[360px] w-[360px] rounded-full bg-blue-500/[0.025] blur-[120px]" />

        <div className="absolute bottom-[-10%] left-[45%] h-[420px] w-[420px] rounded-full bg-purple-500/[0.025] blur-[130px]" />
      </div>

      {/* ========================================
          Welcome / Hero Section
      ======================================== */}

      <section className="relative overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.28)]">
        {/* Hero glow */}

        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-400/[0.09] blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-32 left-[35%] h-72 w-72 rounded-full bg-blue-500/[0.05] blur-[100px]" />

        {/* Decorative grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            {/* ----------------------------------------
                Main Welcome
            ---------------------------------------- */}

            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-40" />
                  <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Legal Intelligence Center
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                Welcome back.
                <span className="block bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  Your intelligence workspace is ready.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Monitor documents, analyze cases, ask your AI assistant,
                and surface legal risks from one intelligent workspace.
              </p>

              {/* Hero capability pills */}

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
                  <Brain className="h-3.5 w-3.5 text-cyan-400" />
                  AI Analysis
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  Risk Intelligence
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
                  <Search className="h-3.5 w-3.5 text-cyan-400" />
                  Case Search
                </div>
              </div>
            </div>

            {/* ----------------------------------------
                System Status Card
            ---------------------------------------- */}

            <div className="w-full shrink-0 xl:w-[280px]">
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur-xl">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/[0.07] blur-2xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07]">
                        <Zap className="h-4 w-4 text-cyan-400" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-white">
                          System Status
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-600">
                          LexAI services
                        </p>
                      </div>
                    </div>

                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                      <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                  </div>

                  <div className="mt-5 border-t border-slate-800/80 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Platform
                      </span>

                      <span className="text-xs font-medium text-emerald-400">
                        Operational
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Intelligence Engine
                      </span>

                      <span className="text-xs font-medium text-cyan-400">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          Intelligence Overview
      ======================================== */}

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />

              <h2 className="text-lg font-semibold tracking-tight text-white">
                Intelligence Overview
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-slate-600">
              Current activity across your LexAI workspace.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600">
            <Activity className="h-3.5 w-3.5 text-cyan-500" />
            Live data
          </div>
        </div>

        {/* Statistics Cards */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="group transition-transform duration-300 hover:-translate-y-1">
            <DashboardCard
              title="Documents"
              value={documentCount}
              icon={<FileText />}
              color="bg-cyan-500/20 text-cyan-400"
            />
          </div>

          <div className="group transition-transform duration-300 hover:-translate-y-1">
            <DashboardCard
              title="AI Queries"
              value={aiQueryCount}
              icon={<Bot />}
              color="bg-purple-500/20 text-purple-400"
            />
          </div>

          <div className="group transition-transform duration-300 hover:-translate-y-1">
            <DashboardCard
              title="Cases"
              value={caseCount}
              icon={<Scale />}
              color="bg-green-500/20 text-green-400"
            />
          </div>

          <div className="group transition-transform duration-300 hover:-translate-y-1">
            <DashboardCard
              title="Risk Alerts"
              value={37}
              icon={<AlertTriangle />}
              color="bg-red-500/20 text-red-400"
            />
          </div>
        </div>
      </section>

      {/* ========================================
          Intelligence Actions Banner
      ======================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-gradient-to-r from-cyan-400/[0.055] via-slate-900/60 to-blue-500/[0.035]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.07] blur-3xl" />

        <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Turn legal information into actionable intelligence.
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Upload a document, search a case, or start a conversation
                with your AI legal assistant.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-cyan-400">
            Explore your tools

            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </section>

      {/* ========================================
          Recent Activity
      ======================================== */}

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />

              <h2 className="text-lg font-semibold tracking-tight text-white">
                Recent Activity
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-slate-600">
              Your latest activity across the legal workspace.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
          <RecentActivity />
        </div>
      </section>

      {/* ========================================
          Analytics
      ======================================== */}

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />

              <h2 className="text-lg font-semibold tracking-tight text-white">
                Analytics
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-slate-600">
              Review trends and activity across your legal workspace.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-700 sm:flex">
            <Activity className="h-3.5 w-3.5" />
            Workspace insights
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/25 p-1 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
          <AnalyticsCharts />
        </div>
      </section>

      {/* ========================================
          Quick Actions
      ======================================== */}

      <section>
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />

            <h2 className="text-lg font-semibold tracking-tight text-white">
              Quick Actions
            </h2>
          </div>

          <p className="mt-1.5 text-sm text-slate-600">
            Access your most frequently used legal intelligence tools.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/25 p-1 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
          <QuickActions />
        </div>
      </section>

      {/* ========================================
          Bottom Intelligence Status
      ======================================== */}

      <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900">
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-72 -translate-x-1/2 rounded-full bg-cyan-400/[0.05] blur-3xl" />

        <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06]">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-300">
                LexAI Intelligence Engine
              </p>

              <p className="mt-0.5 text-[10px] text-slate-700">
                Your legal workspace is protected and ready.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-700">
              All systems operational
            </span>
          </div>
        </div>
      </section>

      {/* ========================================
          Dashboard Footer
      ======================================== */}

      <div className="flex flex-col gap-2 border-t border-slate-800/70 pt-6 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-700">
          LexAI • AI-Powered Legal Intelligence Platform
        </p>

        <p className="text-[10px] text-slate-800">
          Legal intelligence workspace
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
