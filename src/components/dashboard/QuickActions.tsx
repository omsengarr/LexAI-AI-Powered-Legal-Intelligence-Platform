import { useNavigate } from "react-router-dom";
import {
  Upload,
  MessageSquare,
  Search,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Upload Document",
      description: "Analyze a legal document with LexAI",
      icon: Upload,
      onClick: () => navigate("/documents/upload"),
      accent: "cyan",
    },
    {
      title: "Start AI Chat",
      description: "Ask questions and explore legal insights",
      icon: MessageSquare,
      onClick: () => navigate("/chat"),
      accent: "purple",
    },
    {
      title: "Search Cases",
      description: "Find relevant cases and judgments",
      icon: Search,
      onClick: () => navigate("/cases"),
      accent: "blue",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#080e19]">

      {/* ========================================
          Ambient Background
      ======================================== */}

      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-cyan-400/[0.035] blur-[90px]" />

      <div className="pointer-events-none absolute -bottom-24 right-[-40px] h-56 w-56 rounded-full bg-purple-500/[0.025] blur-[90px]" />


      <div className="relative p-5 sm:p-6">

        {/* ========================================
            Header
        ======================================== */}

        <div className="mb-5 flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-white">
                Quick Actions
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-600">
                Start your next legal intelligence task
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            Action Cards
        ======================================== */}

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">

          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                onClick={action.onClick}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-950/50
                  p-4
                  text-left
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-slate-700
                  hover:bg-slate-900/70
                  focus:outline-none
                  focus:ring-1
                  focus:ring-cyan-400/30
                "
              >

                {/* Hover glow */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8
                    h-24
                    w-24
                    rounded-full
                    blur-2xl
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                    ${
                      action.accent === "cyan"
                        ? "bg-cyan-400/10"
                        : action.accent === "purple"
                        ? "bg-purple-400/10"
                        : "bg-blue-400/10"
                    }
                  `}
                />


                <div className="relative">

                  <div className="flex items-start justify-between">

                    {/* Icon */}

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        transition-all
                        duration-300
                        group-hover:scale-105
                        ${
                          action.accent === "cyan"
                            ? "border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-400 group-hover:border-cyan-400/25 group-hover:bg-cyan-400/[0.1]"
                            : action.accent === "purple"
                            ? "border-purple-400/15 bg-purple-400/[0.07] text-purple-400 group-hover:border-purple-400/25 group-hover:bg-purple-400/[0.1]"
                            : "border-blue-400/15 bg-blue-400/[0.07] text-blue-400 group-hover:border-blue-400/25 group-hover:bg-blue-400/[0.1]"
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                    </div>


                    {/* Arrow */}

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-700 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-cyan-400">

                      <ArrowUpRight className="h-4 w-4" />

                    </div>

                  </div>


                  {/* Text */}

                  <div className="mt-5">

                    <h3 className="text-xs font-semibold text-slate-200 transition-colors duration-300 group-hover:text-white">
                      {action.title}
                    </h3>

                    <p className="mt-1.5 text-[10px] leading-5 text-slate-600">
                      {action.description}
                    </p>

                  </div>


                  {/* Bottom indicator */}

                  <div className="mt-4 flex items-center gap-2">

                    <span
                      className={`
                        h-1 w-1 rounded-full
                        ${
                          action.accent === "cyan"
                            ? "bg-cyan-400"
                            : action.accent === "purple"
                            ? "bg-purple-400"
                            : "bg-blue-400"
                        }
                      `}
                    />

                    <span className="text-[9px] uppercase tracking-[0.12em] text-slate-700 transition-colors duration-300 group-hover:text-slate-500">
                      Open tool
                    </span>

                  </div>

                </div>

              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default QuickActions;