import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBalanceScale,
  FaBrain,
  FaCheck,
  FaLayerGroup,
  FaShieldAlt,
} from "react-icons/fa";

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#020617] py-28 text-white sm:py-36"
    >
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-200px] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[140px]" />

        <div className="absolute right-[-150px] bottom-[10%] h-[450px] w-[450px] rounded-full bg-blue-600/5 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
                About LexAI
              </span>
            </div>

            <p className="text-sm text-slate-500">
              Built for the future of legal intelligence.
            </p>
          </div>

          <div>
            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
              Legal research,
              <span className="block text-slate-500">
                reimagined with AI.
              </span>
            </h2>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN CONTENT */}
        {/* ========================================================= */}

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          {/* ======================================================= */}
          {/* MAIN STORY CARD */}
          {/* ======================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/70 p-7 backdrop-blur-xl sm:p-10"
          >
            {/* Glow */}
            <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[350px] w-[350px] rounded-full bg-cyan-400/10 blur-[120px]" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <FaBalanceScale className="text-xl text-cyan-400" />
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Why LexAI
              </p>

              <h3 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Turn hours of legal research into intelligent insights.
              </h3>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Legal professionals spend significant amounts of time
                searching through cases, reading judgments, reviewing
                documents, and connecting legal information. LexAI brings
                these workflows together with AI-powered tools designed to
                make legal research faster and more organized.
              </p>

              {/* Divider */}
              <div className="my-8 h-px bg-slate-800" />

              {/* Benefits */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
                    <FaCheck className="text-[10px] text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Faster research
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Find relevant legal information with less manual work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
                    <FaCheck className="text-[10px] text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Connected intelligence
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Bring cases, documents, and AI assistance together.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
                    <FaCheck className="text-[10px] text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Clear insights
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Transform complex legal information into useful insights.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/10">
                    <FaCheck className="text-[10px] text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      One workspace
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Keep your legal intelligence in one organized place.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom statement */}
              <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Built to help legal professionals work smarter.
                </p>

                <a
                  href="#features"
                  className="group flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-400"
                >
                  Explore the platform

                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* ======================================================= */}
          {/* RIGHT SIDE CARDS */}
          {/* ======================================================= */}

          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
            {/* Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group rounded-[28px] border border-slate-800 bg-slate-950/60 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <FaBrain className="text-cyan-400" />
              </div>

              <h4 className="mt-6 text-lg font-semibold text-white">
                Intelligence first
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                AI is integrated directly into the research workflow instead
                of being treated as a separate tool.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                AI-powered workflows
              </div>
            </motion.div>

            {/* Workspace */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group rounded-[28px] border border-slate-800 bg-slate-950/60 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <FaLayerGroup className="text-cyan-400" />
              </div>

              <h4 className="mt-6 text-lg font-semibold text-white">
                One workspace
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Research, documents, cases, analytics, and AI assistance are
                connected within one platform.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Connected legal tools
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group rounded-[28px] border border-slate-800 bg-slate-950/60 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <FaShieldAlt className="text-cyan-400" />
              </div>

              <h4 className="mt-6 text-lg font-semibold text-white">
                Designed for legal work
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                A focused interface built around the way legal information
                is searched, analyzed, and reviewed.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Legal-first experience
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM QUOTE / STATEMENT */}
        {/* ========================================================= */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 border-t border-slate-800 pt-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              The future of legal research is not about replacing expertise.
              It is about giving legal professionals better tools to use it.
            </p>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />

              <span className="text-xs uppercase tracking-[0.2em] text-slate-600">
                LexAI Platform
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;