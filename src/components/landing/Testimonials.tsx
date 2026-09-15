import { motion } from "framer-motion";
import {
  FaQuoteLeft,
  FaArrowRight,
  FaStar,
  FaBalanceScale,
} from "react-icons/fa";

const testimonials = [
  {
    quote:
      "LexAI makes legal research feel significantly more organized. I can move from a case search to document analysis without constantly switching between different tools.",
    name: "Aarav Sharma",
    role: "Legal Researcher",
    initials: "AS",
  },
  {
    quote:
      "The AI assistant is especially useful when working through long and complicated legal material. It helps surface the information I actually need to focus on.",
    name: "Priya Mehta",
    role: "Law Student",
    initials: "PM",
  },
  {
    quote:
      "Having case research, documents, compliance analysis, and AI assistance in one workspace creates a much cleaner legal workflow.",
    name: "Rohan Verma",
    role: "Legal Professional",
    initials: "RV",
  },
];

function Testimonials() {
  return (
    <section
      className="relative overflow-hidden bg-[#020617] py-28 text-white sm:py-36"
    >
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[20%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
                Trusted workflow
              </span>
            </div>

            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Built for people
              <span className="block text-slate-500">
                who work with law.
              </span>
            </h2>
          </div>

          <div className="lg:flex lg:justify-end">
            <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base">
              From research and analysis to document intelligence, LexAI is
              designed to reduce repetitive work and help legal professionals
              focus on what matters.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FEATURED QUOTE */}
        {/* ========================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative mt-16 overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/70 p-7 backdrop-blur-xl sm:p-10 lg:p-14"
        >
          {/* Glow */}
          <div className="pointer-events-none absolute right-[-100px] top-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[120px]" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-start">
            {/* Quote icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <FaQuoteLeft className="text-lg text-cyan-400" />
            </div>

            {/* Quote */}
            <div>
              <div className="mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className="text-xs text-cyan-400"
                  />
                ))}
              </div>

              <blockquote className="max-w-4xl text-2xl font-medium leading-relaxed tracking-tight text-white sm:text-3xl lg:text-4xl">
                “LexAI gives legal research a completely different rhythm.
                Instead of spending hours finding and organizing information,
                I can focus on understanding it.”
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-semibold text-cyan-400">
                  AS
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Aarav Sharma
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Legal Researcher
                  </p>
                </div>
              </div>
            </div>

            {/* Side metric */}
            <div className="hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-5 lg:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Experience
              </p>

              <p className="mt-3 text-3xl font-semibold text-white">
                5.0
              </p>

              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className="text-[9px] text-cyan-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* TESTIMONIAL CARDS */}
        {/* ========================================================= */}

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              className="group relative overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950/50 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute right-[-60px] top-[-60px] h-32 w-32 rounded-full bg-cyan-400/5 opacity-0 blur-[60px] transition duration-500 group-hover:opacity-100" />

              <div className="relative">
                {/* Top */}
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-cyan-400">
                    <FaQuoteLeft className="text-xs" />
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className="text-[8px] text-cyan-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="mt-7 text-sm leading-7 text-slate-400">
                  “{testimonial.quote}”
                </p>

                {/* Bottom */}
                <div className="mt-8 flex items-center gap-3 border-t border-slate-800 pt-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-[10px] font-semibold text-cyan-400">
                    {testimonial.initials}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      {testimonial.name}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM STRIP */}
        {/* ========================================================= */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 flex flex-col gap-5 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5">
              <FaBalanceScale className="text-xs text-cyan-400" />
            </div>

            <span className="text-xs text-slate-600">
              Designed around modern legal workflows
            </span>
          </div>

          <a
            href="#contact"
            className="group flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-cyan-400"
          >
            Talk to the LexAI team

            <FaArrowRight className="text-[9px] transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;