import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBalanceScale,
  FaFileAlt,
  FaSearch,
  FaRobot,
  FaShieldAlt,
  FaCodeBranch,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";

interface Feature {
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ElementType;
  number: string;
  label: string;
}

const features: Feature[] = [
  {
    number: "01",
    title: "AI Case Research",
    shortTitle: "Case Research",
    description:
      "Find relevant cases, judgments, statutes, and legal authorities faster with AI-powered research assistance.",
    icon: FaBalanceScale,
    label: "Research Intelligence",
  },
  {
    number: "02",
    title: "Document Intelligence",
    shortTitle: "Documents",
    description:
      "Upload legal documents and let LexAI extract important clauses, entities, dates, risks, and key information.",
    icon: FaFileAlt,
    label: "Document Analysis",
  },
  {
    number: "03",
    title: "Smart Legal Search",
    shortTitle: "Legal Search",
    description:
      "Search legal information using natural language instead of relying only on exact keywords.",
    icon: FaSearch,
    label: "Semantic Search",
  },
  {
    number: "04",
    title: "AI Legal Assistant",
    shortTitle: "AI Assistant",
    description:
      "Ask legal questions, summarize complex material, and explore arguments through an intelligent AI assistant.",
    icon: FaRobot,
    label: "AI Assistance",
  },
  {
    number: "05",
    title: "Compliance Analysis",
    shortTitle: "Compliance",
    description:
      "Identify potential compliance concerns and analyze documents against important legal requirements.",
    icon: FaShieldAlt,
    label: "Risk & Compliance",
  },
  {
    number: "06",
    title: "Judgment Comparison",
    shortTitle: "Comparisons",
    description:
      "Compare judgments, legal reasoning, outcomes, and important differences across multiple cases.",
    icon: FaCodeBranch,
    label: "Judgment Intelligence",
  },
];

function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  const currentFeature = features[activeFeature];
  const CurrentIcon = currentFeature.icon;

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#020617] py-28 text-white sm:py-36"
    >
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-200px] top-[20%] h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[130px]" />

        <div className="absolute right-[-200px] top-[45%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[130px]" />

        {/* IMPORTANT:
            Bottom fade removed.
            The previous transparent gradient was exposing
            the light-mode page background and creating a
            grey/white band between sections.
        */}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ========================================================= */}
        {/* SECTION HEADER */}
        {/* ========================================================= */}

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.5fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
                Platform
              </span>
            </div>

            <h2 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              One workspace.
              <span className="mt-2 block text-slate-500">
                Every legal insight.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              LexAI brings legal research, document analysis, AI assistance,
              compliance, and case intelligence into one connected workspace.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FEATURE SHOWCASE */}
        {/* ========================================================= */}

        <div className="mt-16 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* ======================================================= */}
          {/* FEATURE LIST */}
          {/* ======================================================= */}

          <div className="rounded-[28px] border border-slate-800/80 bg-slate-950/60 p-3 backdrop-blur-xl">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;

              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => setActiveFeature(index)}
                  className={`group relative mb-1 flex w-full items-center gap-4 overflow-hidden rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-400/10"
                      : "hover:bg-slate-900/80"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFeature"
                      className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-cyan-400"
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isActive
                        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-400"
                        : "border-slate-800 bg-slate-900 text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    <Icon className="text-sm" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium transition ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {feature.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {feature.label}
                    </p>
                  </div>

                  {/* Number */}
                  <span
                    className={`text-[10px] font-semibold tracking-widest ${
                      isActive ? "text-cyan-400" : "text-slate-700"
                    }`}
                  >
                    {feature.number}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ======================================================= */}
          {/* FEATURE PREVIEW */}
          {/* ======================================================= */}

          <div className="relative min-h-[620px] overflow-hidden rounded-[32px] border border-slate-800 bg-[#050914]">
            {/* Glow */}
            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[120px]" />

            <div className="pointer-events-none absolute bottom-[-150px] left-[20%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[120px]" />

            {/* ===================================================== */}
            {/* TOP BAR */}
            {/* ===================================================== */}

            <div className="relative flex items-center justify-between border-b border-slate-800 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                  <CurrentIcon className="text-sm text-cyan-400" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
                    LexAI
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-white">
                    {currentFeature.label}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] uppercase tracking-wider text-emerald-400">
                  AI Ready
                </span>
              </div>
            </div>

            {/* ===================================================== */}
            {/* CONTENT */}
            {/* ===================================================== */}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.3 }}
                className="relative p-6 sm:p-8 lg:p-10"
              >
                {/* Heading */}
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                      {currentFeature.number}
                    </span>

                    <span className="h-px w-8 bg-slate-800" />
                  </div>

                  <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {currentFeature.title}
                  </h3>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                    {currentFeature.description}
                  </p>
                </div>

                {/* ================================================= */}
                {/* FAKE PRODUCT INTERFACE */}
                {/* ================================================= */}

                <div className="mt-10 overflow-hidden rounded-[24px] border border-slate-800 bg-slate-950 shadow-2xl shadow-black/30">
                  {/* Browser header */}
                  <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
                    </div>

                    <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-slate-600">
                      LexAI Intelligence
                    </span>

                    <div className="w-10" />
                  </div>

                  <div className="grid md:grid-cols-[170px_1fr]">
                    {/* Mini sidebar */}
                    <div className="hidden border-r border-slate-800 p-4 md:block">
                      <div className="mb-5 flex items-center gap-2">
                        <FaBalanceScale className="text-xs text-cyan-400" />

                        <span className="text-xs font-medium text-slate-300">
                          Workspace
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="rounded-lg bg-cyan-400/10 px-3 py-2 text-[10px] text-cyan-300">
                          Overview
                        </div>

                        <div className="rounded-lg px-3 py-2 text-[10px] text-slate-600">
                          Cases
                        </div>

                        <div className="rounded-lg px-3 py-2 text-[10px] text-slate-600">
                          Documents
                        </div>

                        <div className="rounded-lg px-3 py-2 text-[10px] text-slate-600">
                          AI Assistant
                        </div>
                      </div>
                    </div>

                    {/* Main interface */}
                    <div className="p-5 sm:p-7">
                      {/* Search */}
                      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                        <FaSearch className="text-xs text-slate-600" />

                        <span className="flex-1 truncate text-xs text-slate-600">
                          Ask LexAI anything about this matter...
                        </span>

                        <span className="hidden rounded-md bg-cyan-400 px-2 py-1 text-[9px] font-semibold text-slate-950 sm:block">
                          Search
                        </span>
                      </div>

                      {/* Result area */}
                      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        {/* Main result */}
                        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaFileAlt className="text-xs text-cyan-400" />

                              <span className="text-xs font-medium text-white">
                                AI Analysis
                              </span>
                            </div>

                            <span className="text-[9px] text-emerald-400">
                              High relevance
                            </span>
                          </div>

                          <div className="mt-5 space-y-3">
                            <div className="h-2 w-full rounded-full bg-slate-800" />
                            <div className="h-2 w-[92%] rounded-full bg-slate-800" />
                            <div className="h-2 w-[78%] rounded-full bg-slate-800" />
                            <div className="h-2 w-[88%] rounded-full bg-slate-800" />
                            <div className="h-2 w-[64%] rounded-full bg-slate-800" />
                          </div>

                          <div className="mt-6 rounded-lg border border-cyan-400/10 bg-cyan-400/5 p-3">
                            <div className="flex items-start gap-2">
                              <FaRobot className="mt-0.5 text-[10px] text-cyan-400" />

                              <div>
                                <p className="text-[10px] font-medium text-slate-300">
                                  AI-generated insight
                                </p>

                                <p className="mt-1 text-[9px] leading-5 text-slate-600">
                                  Relevant legal reasoning and supporting
                                  authorities identified.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Side result */}
                        <div className="space-y-4">
                          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                            <p className="text-[9px] uppercase tracking-widest text-slate-600">
                              Confidence
                            </p>

                            <div className="mt-3 flex items-end justify-between">
                              <span className="text-3xl font-semibold text-white">
                                98%
                              </span>

                              <FaCheck className="mb-1 text-cyan-400" />
                            </div>

                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "98%" }}
                                transition={{
                                  duration: 1,
                                  ease: "easeOut",
                                }}
                                className="h-full rounded-full bg-cyan-400"
                              />
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                            <p className="text-[9px] uppercase tracking-widest text-slate-600">
                              Key findings
                            </p>

                            <div className="mt-4 space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                                <span className="text-[9px] text-slate-500">
                                  Relevant authority
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                                <span className="text-[9px] text-slate-500">
                                  Legal principle
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                                <span className="text-[9px] text-slate-500">
                                  Case outcome
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom status */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                          <span className="text-[9px] text-slate-500">
                            Analysis complete
                          </span>
                        </div>

                        <div className="hidden h-3 w-px bg-slate-800 sm:block" />

                        <span className="text-[9px] text-slate-600">
                          Sources verified
                        </span>

                        <span className="ml-auto text-[9px] text-cyan-400">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learn more */}
                <button
                  type="button"
                  className="group mt-7 flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-400"
                >
                  Explore {currentFeature.shortTitle}

                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM FEATURE STATEMENT */}
        {/* ========================================================= */}

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
              Built for
            </p>

            <p className="mt-2 text-sm font-medium text-slate-300">
              Faster legal research
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
              Powered by
            </p>

            <p className="mt-2 text-sm font-medium text-slate-300">
              Artificial intelligence
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
              Designed for
            </p>

            <p className="mt-2 text-sm font-medium text-slate-300">
              Modern legal professionals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;