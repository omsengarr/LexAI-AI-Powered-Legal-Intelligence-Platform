import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaBalanceScale,
  FaFileAlt,
  FaRobot,
  FaSearch,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function DemoModal({ isOpen, onClose }: DemoModalProps) {
  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ duration: 0.3 }}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[32px] border border-slate-700 bg-[#020617] shadow-2xl shadow-black/70"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close demo"
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-400"
            >
              <FaTimes />
            </button>

            {/* Glow */}
            <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

            {/* Header */}
            <div className="relative px-6 pb-8 pt-10 text-center sm:px-10 sm:pt-14">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <FaBalanceScale className="text-xl text-cyan-400" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Product walkthrough
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                Meet your new
                <span className="block text-slate-500">
                  legal workspace.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                See how LexAI brings legal research, document intelligence,
                and AI assistance together in one powerful workspace.
              </p>
            </div>

            {/* Product Preview */}
            <div className="relative px-4 pb-6 sm:px-8 sm:pb-10">

              <div className="overflow-hidden rounded-[24px] border border-slate-800 bg-[#050914] shadow-2xl">

                {/* Browser bar */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-4">

                  <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      LexAI Workspace
                    </span>
                  </div>

                  <div className="w-16" />

                </div>

                {/* Dashboard */}
                <div className="grid min-h-[420px] md:grid-cols-[190px_1fr]">

                  {/* Sidebar */}
                  <div className="hidden border-r border-slate-800 p-5 md:block">

                    <div className="flex items-center gap-2">
                      <FaBalanceScale className="text-cyan-400" />

                      <span className="font-semibold text-white">
                        LexAI
                      </span>
                    </div>

                    <div className="mt-8 space-y-2">

                      <div className="flex items-center gap-3 rounded-xl bg-cyan-400/10 px-3 py-3 text-sm text-cyan-300">
                        <FaSearch />
                        Overview
                      </div>

                      <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
                        <FaFileAlt />
                        Documents
                      </div>

                      <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
                        <FaBalanceScale />
                        Cases
                      </div>

                      <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
                        <FaRobot />
                        AI Assistant
                      </div>

                    </div>

                  </div>

                  {/* Main content */}
                  <div className="p-5 sm:p-8">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                          Dashboard
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold text-white">
                          Legal Intelligence
                        </h3>
                      </div>

                      <div className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-400">
                        AI Ready
                      </div>

                    </div>

                    {/* Search */}
                    <div className="mt-7 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">

                      <FaSearch className="text-slate-600" />

                      <span className="text-sm text-slate-600">
                        Search cases, judgments, statutes...
                      </span>

                    </div>

                    {/* Cards */}
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">

                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                        <FaBalanceScale className="text-cyan-400" />

                        <p className="mt-4 text-2xl font-semibold text-white">
                          642
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          Cases researched
                        </p>

                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                        <FaFileAlt className="text-cyan-400" />

                        <p className="mt-4 text-2xl font-semibold text-white">
                          1,284
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          Documents
                        </p>

                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                        <FaRobot className="text-cyan-400" />

                        <p className="mt-4 text-2xl font-semibold text-white">
                          AI
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          Assistant
                        </p>

                      </div>

                    </div>

                    {/* AI Analysis */}
                    <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 p-5">

                      <div className="flex items-start gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                          <FaRobot className="text-cyan-400" />
                        </div>

                        <div className="flex-1">

                          <div className="flex items-center justify-between gap-4">

                            <div>
                              <p className="text-sm font-medium text-white">
                                AI Research Insight
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                Automated legal analysis
                              </p>
                            </div>

                            <span className="text-xs text-cyan-400">
                              98%
                            </span>

                          </div>

                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-900">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "98%" }}
                              transition={{
                                duration: 1.2,
                                delay: 0.3,
                              }}
                              className="h-full rounded-full bg-cyan-400"
                            />
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Insight list */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">

                        <FaCheckCircle className="text-cyan-400" />

                        <span className="text-xs text-slate-400">
                          Relevant cases identified
                        </span>

                      </div>

                      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">

                        <FaCheckCircle className="text-cyan-400" />

                        <span className="text-xs text-slate-400">
                          Key legal concepts extracted
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Bottom CTA */}
            <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-6 sm:px-10">

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div>
                  <p className="text-sm font-medium text-white">
                    Ready to try LexAI?
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Start your legal research workspace today.
                  </p>
                </div>

                <a
                  href="/signup"
                  className="group flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Get Started

                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </a>

              </div>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DemoModal;