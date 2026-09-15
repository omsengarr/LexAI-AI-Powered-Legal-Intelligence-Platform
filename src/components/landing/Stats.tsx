import { motion } from "framer-motion";
import {
  FaArrowUp,
  FaBalanceScale,
  FaBolt,
  FaFileAlt,
  FaUsers,
} from "react-icons/fa";

const stats = [
  {
    value: "10K+",
    label: "Legal documents",
    description: "Documents processed and analyzed",
    icon: FaFileAlt,
  },
  {
    value: "98%",
    label: "AI accuracy",
    description: "High-confidence legal insights",
    icon: FaBolt,
  },
  {
    value: "50+",
    label: "Legal workflows",
    description: "Tools built for legal professionals",
    icon: FaBalanceScale,
  },
  {
    value: "24/7",
    label: "AI availability",
    description: "Intelligence when you need it",
    icon: FaUsers,
  },
];

function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#020617] py-24 text-white sm:py-32">
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ========================================================= */}
        {/* TOP INTRO */}
        {/* ========================================================= */}

        <div className="flex flex-col gap-6 border-b border-slate-800 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
                By the numbers
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              Built to make legal work
              <span className="text-slate-500"> more intelligent.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-slate-600">
            A modern legal intelligence platform designed around speed,
            clarity, and AI-assisted research.
          </p>
        </div>

        {/* ========================================================= */}
        {/* STATS */}
        {/* ========================================================= */}

        <div className="grid border-b border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className={`group relative px-2 py-10 sm:px-7 lg:py-14 ${
                  index !== 0
                    ? "border-t border-slate-800 sm:border-l lg:border-t-0"
                    : ""
                }`}
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[70px]" />
                </div>

                <div className="relative">
                  {/* Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-500 transition duration-300 group-hover:border-cyan-400/20 group-hover:text-cyan-400">
                      <Icon className="text-sm" />
                    </div>

                    <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-700">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Number */}
                  <div className="mt-8 flex items-start">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1 + 0.2,
                      }}
                      className="text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl"
                    >
                      {stat.value}
                    </motion.span>

                    {index === 1 && (
                      <FaArrowUp className="ml-2 mt-2 text-xs text-cyan-400" />
                    )}
                  </div>

                  {/* Label */}
                  <p className="mt-5 text-sm font-medium text-slate-300">
                    {stat.label}
                  </p>

                  {/* Description */}
                  <p className="mt-2 max-w-[190px] text-xs leading-5 text-slate-600">
                    {stat.description}
                  </p>

                  {/* Bottom line */}
                  <div className="mt-7 h-px w-8 bg-slate-800 transition-all duration-300 group-hover:w-14 group-hover:bg-cyan-400/50" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM STATEMENT */}
        {/* ========================================================= */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-30" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
            </span>

            <span className="text-xs uppercase tracking-[0.2em] text-slate-600">
              Intelligence is always available
            </span>
          </div>

          <p className="text-xs text-slate-700">
            Research faster. Analyze deeper. Work smarter.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Stats;