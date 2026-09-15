import { useState } from "react";
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

const complianceItems = [
  {
    title: "Data Processing Clause",
    status: true,
  },
  {
    title: "Consent Clause",
    status: true,
  },
  {
    title: "Confidentiality Clause",
    status: true,
  },
  {
    title: "Right to Erasure",
    status: false,
  },
  {
    title: "Data Retention Policy",
    status: false,
  },
];

function CompliancePage() {
  const [regulation, setRegulation] = useState("GDPR");

  const compliantCount = complianceItems.filter(
    (item) => item.status
  ).length;

  const issueCount = complianceItems.length - compliantCount;

  const compliancePercentage = Math.round(
    (compliantCount / complianceItems.length) * 100
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10 space-y-8">
        {/* Page Header */}
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

            {/* Protection status */}
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
                  Ready
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Regulation + Overview */}
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
                onChange={(e) => setRegulation(e.target.value)}
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
                <option value="GDPR">GDPR</option>
                <option value="DPDP">DPDP</option>
                <option value="HIPAA">HIPAA</option>
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

          {/* Quick Overview */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Compliance Overview
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Document readiness
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/70">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-slate-500" />
                  <p className="text-xs text-slate-500">Requirements</p>
                </div>

                <p className="mt-3 text-2xl font-bold text-white">
                  {complianceItems.length}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs text-slate-500">Compliant</p>
                </div>

                <p className="mt-3 text-2xl font-bold text-white">
                  {compliantCount}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/10 bg-rose-500/[0.04] p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <p className="text-xs text-slate-500">Needs Attention</p>
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
                  style={{ width: `${compliancePercentage}%` }}
                />
              </div>
            </div>
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

          <ComplianceScoreCard score={87} />
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
            {complianceItems.map((item, index) => (
              <ComplianceItem
                key={index}
                title={item.title}
                status={item.status}
              />
            ))}
          </div>
        </section>

        {/* Suggestions */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              AI Guidance
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Recommended Actions
            </h2>
          </div>

          <ComplianceSuggestion
            suggestion={`Add a Right to Erasure clause and a Data Retention Policy to improve compliance with ${regulation} requirements.`}
          />
        </section>
      </div>
    </main>
  );
}

export default CompliancePage;