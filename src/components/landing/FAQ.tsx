import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight,
  FaBalanceScale,
  FaPlus,
} from "react-icons/fa";

const faqs = [
  {
    question: "What is LexAI?",
    answer:
      "LexAI is an AI-powered legal intelligence platform that brings legal research, document analysis, case intelligence, compliance analysis, and AI assistance together in one workspace.",
  },
  {
    question: "How does LexAI help with legal research?",
    answer:
      "LexAI helps organize legal research by allowing users to search cases, judgments, statutes, and legal topics while using AI to surface relevant information and generate useful insights.",
  },
  {
    question: "Can I analyze legal documents?",
    answer:
      "Yes. LexAI is designed to help analyze legal documents and identify important information such as clauses, entities, dates, risks, and other relevant content.",
  },
  {
    question: "Can LexAI compare different judgments?",
    answer:
      "Yes. The Judgment Comparison workflow is designed to help users examine differences in legal reasoning, outcomes, important findings, and other relevant aspects across multiple judgments.",
  },
  {
    question: "Does LexAI replace a lawyer?",
    answer:
      "No. LexAI is designed as an intelligence and productivity tool that assists legal professionals with research and analysis. Legal decisions and professional judgment should remain with qualified legal professionals.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#020617] py-28 text-white sm:py-36"
    >
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-200px] top-[20%] h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[130px]" />

        <div className="absolute right-[-200px] bottom-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
                FAQ
              </span>
            </div>

            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Questions,
              <span className="block text-slate-500">
                answered simply.
              </span>
            </h2>
          </div>

          <div className="lg:flex lg:justify-end">
            <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base">
              Everything you need to know about the LexAI platform and how
              it fits into a modern legal research workflow.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FAQ CONTENT */}
        {/* ========================================================= */}

        <div className="mt-16 grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* ======================================================= */}
          {/* LEFT CARD */}
          {/* ======================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative hidden overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950/60 p-7 backdrop-blur-xl lg:block"
          >
            {/* Glow */}
            <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-cyan-400/10 blur-[80px]" />

            <div className="relative">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <FaBalanceScale className="text-cyan-400" />
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                LexAI
              </p>

              <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
                Legal intelligence without the complexity.
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Explore research, documents, cases, compliance, and AI
                assistance from one connected platform.
              </p>

              {/* Mini stats */}
              <div className="mt-8 border-t border-slate-800 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    Platform status
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="text-xs text-emerald-400">
                      Operational
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    AI assistance
                  </span>

                  <span className="text-xs text-cyan-400">
                    Available
                  </span>
                </div>
              </div>

              {/* CTA */}
              <a
                href="#contact"
                className="group mt-8 flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-cyan-400"
              >
                Still have questions?

                <FaArrowRight className="text-[9px] transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* ======================================================= */}
          {/* ACCORDION */}
          {/* ======================================================= */}

          <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950/50 backdrop-blur-xl">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  className={`relative border-b border-slate-800 last:border-b-0 ${
                    isOpen ? "bg-cyan-400/[0.025]" : ""
                  }`}
                >
                  {/* Active indicator */}
                  {isOpen && (
                    <motion.div
                      layoutId="faqIndicator"
                      className="absolute bottom-5 left-0 top-5 w-0.5 rounded-full bg-cyan-400"
                    />
                  )}

                  {/* Question */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-5 px-6 py-6 text-left sm:px-8"
                  >
                    {/* Number */}
                    <span
                      className={`hidden text-[10px] font-semibold tracking-[0.2em] sm:block ${
                        isOpen ? "text-cyan-400" : "text-slate-700"
                      }`}
                    >
                      0{index + 1}
                    </span>

                    {/* Question */}
                    <span
                      className={`flex-1 text-sm font-medium transition sm:text-base ${
                        isOpen ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {faq.question}
                    </span>

                    {/* Plus */}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
                          : "border-slate-800 bg-slate-900 text-slate-600"
                      }`}
                    >
                      <FaPlus className="text-[10px]" />
                    </span>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-7 sm:px-8 sm:pb-8 sm:pl-[84px]">
                          <p className="max-w-2xl text-sm leading-7 text-slate-500">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM CTA */}
        {/* ========================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col gap-5 rounded-[24px] border border-slate-800 bg-slate-950/40 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        >
          <div>
            <p className="text-sm font-medium text-white">
              Ready to explore LexAI?
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Start building a faster legal research workflow.
            </p>
          </div>

          <a
            href="/signup"
            className="group flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Get Started

            <FaArrowRight className="text-[9px] transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQ;