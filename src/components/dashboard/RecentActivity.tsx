import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaRobot,
  FaBalanceScale,
  FaChevronRight,
} from "react-icons/fa";

const activities = [
  {
    icon: <FaFileAlt />,
    title: "Contract.pdf uploaded",
    time: "5 minutes ago",
    type: "Document",
  },
  {
    icon: <FaRobot />,
    title: "AI summarized Supreme Court judgment",
    time: "20 minutes ago",
    type: "AI Analysis",
  },
  {
    icon: <FaBalanceScale />,
    title: "Compared two legal cases",
    time: "1 hour ago",
    type: "Case Analysis",
  },
  {
    icon: <FaRobot />,
    title: "Generated legal research report",
    time: "2 hours ago",
    type: "AI Research",
  },
];

function RecentActivity() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#080e19]">

      {/* Ambient glow */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/[0.035] blur-[90px]" />

      <div className="relative">

        {/* ========================================
            Header
        ======================================== */}

        <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-5 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <FaRobot className="text-sm text-cyan-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Recent Activity
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-600">
                Latest workspace events
              </p>
            </div>

          </div>


          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/50 px-2.5 py-1.5">

            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-30" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>

            <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-600">
              Live
            </span>

          </div>

        </div>


        {/* ========================================
            Activity List
        ======================================== */}

        <div className="divide-y divide-slate-800/60">

          {activities.map((activity, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.06,
              }}
              className="group relative flex items-center gap-4 px-5 py-4 transition-all duration-300 hover:bg-white/[0.018] sm:px-6"
            >

              {/* Active indicator */}

              <div className="absolute left-0 top-1/2 h-7 w-[2px] -translate-y-1/2 rounded-r-full bg-cyan-400 opacity-0 shadow-[0_0_12px_rgba(34,211,238,0.7)] transition-opacity duration-300 group-hover:opacity-100" />


              {/* Activity icon */}

              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/70 text-sm text-cyan-400 transition-all duration-300 group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.06]">

                {activity.icon}

              </div>


              {/* Activity content */}

              <div className="min-w-0 flex-1">

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">

                  <h3 className="truncate text-xs font-medium text-slate-300 transition-colors duration-300 group-hover:text-white">
                    {activity.title}
                  </h3>

                  <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

                  <span className="shrink-0 text-[10px] text-slate-600">
                    {activity.type}
                  </span>

                </div>


                <p className="mt-1 text-[10px] text-slate-700">
                  {activity.time}
                </p>

              </div>


              {/* Arrow */}

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-700 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-cyan-500 group-hover:opacity-100">

                <FaChevronRight className="text-[9px]" />

              </div>

            </motion.div>

          ))}

        </div>


        {/* ========================================
            Footer
        ======================================== */}

        <div className="border-t border-slate-800/60 px-5 py-3.5 sm:px-6">

          <div className="flex items-center justify-between">

            <span className="text-[9px] uppercase tracking-[0.14em] text-slate-700">
              Workspace activity
            </span>

            <span className="text-[9px] text-slate-700">
              4 recent events
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RecentActivity;