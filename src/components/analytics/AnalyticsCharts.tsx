import { Line, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);


// ==========================================
// WEEKLY UPLOAD DATA
// ==========================================

const weeklyUploadData = {
  labels: [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ],

  datasets: [
    {
      label: "Documents Uploaded",

      data: [
        4,
        8,
        6,
        12,
        9,
        15,
        11,
      ],

      borderColor: "#4cc9e8",

      backgroundColor: "rgba(76, 201, 232, 0.12)",

      tension: 0.4,

      fill: true,

      pointRadius: 3,

      pointHoverRadius: 5,

      pointBackgroundColor: "#4cc9e8",

      pointBorderColor: "#07111d",

      pointBorderWidth: 2,
    },
  ],
};


// ==========================================
// AI FEATURE DATA
// ==========================================

const aiFeatureData = {
  labels: [
    "AI Chat",
    "Case Search",
    "Risk Analysis",
    "Compliance",
  ],

  datasets: [
    {
      data: [
        35,
        25,
        20,
        20,
      ],

      backgroundColor: [
        "#4cc9e8",
        "#8b5cf6",
        "#5bc85b",
        "#ef4444",
      ],

      borderColor: "#07111d",

      borderWidth: 3,

      hoverOffset: 6,
    },
  ],
};


// ==========================================
// WEEKLY UPLOAD OPTIONS
// ==========================================

const weeklyUploadOptions = {
  responsive: true,

  maintainAspectRatio: false,

  interaction: {
    intersect: false,
    mode: "index" as const,
  },

  plugins: {
    legend: {
      position: "top" as const,

      align: "end" as const,

      labels: {
        color: "#64748b",

        boxWidth: 8,

        boxHeight: 8,

        borderRadius: 4,

        usePointStyle: true,

        pointStyle: "circle",

        padding: 18,

        font: {
          size: 10,
        },
      },
    },

    tooltip: {
      enabled: true,

      backgroundColor: "#0b1220",

      borderColor: "rgba(148, 163, 184, 0.15)",

      borderWidth: 1,

      titleColor: "#ffffff",

      bodyColor: "#94a3b8",

      padding: 12,

      cornerRadius: 10,

      displayColors: true,
    },
  },

  scales: {
    x: {
      border: {
        display: false,
      },

      grid: {
        display: false,
      },

      ticks: {
        color: "#475569",

        font: {
          size: 10,
        },

        padding: 8,
      },
    },

    y: {
      beginAtZero: false,

      border: {
        display: false,
      },

      grid: {
        color: "rgba(51, 65, 85, 0.18)",
      },

      ticks: {
        color: "#475569",

        font: {
          size: 10,
        },

        padding: 8,
      },
    },
  },
};


// ==========================================
// AI FEATURE OPTIONS
// ==========================================

const aiFeatureOptions = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "bottom" as const,

      align: "center" as const,

      labels: {
        color: "#64748b",

        padding: 16,

        boxWidth: 8,

        boxHeight: 8,

        borderRadius: 4,

        usePointStyle: true,

        pointStyle: "circle",

        font: {
          size: 10,
        },
      },
    },

    tooltip: {
      enabled: true,

      backgroundColor: "#0b1220",

      borderColor: "rgba(148, 163, 184, 0.15)",

      borderWidth: 1,

      titleColor: "#ffffff",

      bodyColor: "#94a3b8",

      padding: 12,

      cornerRadius: 10,
    },
  },

  cutout: "68%",
};


// ==========================================
// ANALYTICS COMPONENT
// ==========================================

function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">


      {/* ======================================
          WEEKLY UPLOAD TREND
      ====================================== */}

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800/80
          bg-[#080e19]
          p-5
          shadow-[0_20px_60px_rgba(0,0,0,0.14)]
          transition-all
          duration-300
          hover:border-slate-700
          sm:p-6
        "
      >

        {/* Ambient glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-cyan-400/[0.045]
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-cyan-400/[0.07]
          "
        />


        {/* Top accent */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-cyan-400/25
            to-transparent
          "
        />


        <div className="relative">

          {/* Header */}

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-500">
                  Activity
                </span>

              </div>

              <h3 className="mt-2 text-sm font-semibold tracking-tight text-white">
                Weekly Upload Trend
              </h3>

              <p className="mt-1 text-[10px] text-slate-600">
                Document activity over the last seven days.
              </p>

            </div>


            <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">

              <span className="text-[9px] font-medium text-slate-500">
                7 DAYS
              </span>

            </div>

          </div>


          {/* Chart */}

          <div className="mt-6 h-[280px]">

            <Line
              data={weeklyUploadData}
              options={weeklyUploadOptions}
            />

          </div>


          {/* Bottom summary */}

          <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-4">

            <div>

              <p className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
                Weekly total
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                65
              </p>

            </div>


            <div className="text-right">

              <p className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
                Peak day
              </p>

              <p className="mt-1 text-sm font-semibold text-cyan-400">
                Saturday
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          AI FEATURE USAGE
      ====================================== */}

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800/80
          bg-[#080e19]
          p-5
          shadow-[0_20px_60px_rgba(0,0,0,0.14)]
          transition-all
          duration-300
          hover:border-slate-700
          sm:p-6
        "
      >

        {/* Ambient glow */}

        <div
          className="
            pointer-events-none
            absolute
            -left-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-purple-400/[0.035]
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-purple-400/[0.06]
          "
        />


        {/* Top accent */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-purple-400/20
            to-transparent
          "
        />


        <div className="relative">

          {/* Header */}

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.7)]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-purple-400">
                  Intelligence
                </span>

              </div>

              <h3 className="mt-2 text-sm font-semibold tracking-tight text-white">
                AI Feature Usage
              </h3>

              <p className="mt-1 text-[10px] text-slate-600">
                Distribution of your AI-powered workspace activity.
              </p>

            </div>


            <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5">

              <span className="text-[9px] font-medium text-slate-500">
                USAGE
              </span>

            </div>

          </div>


          {/* Chart */}

          <div className="relative mt-4 h-[300px]">

            <Doughnut
              data={aiFeatureData}
              options={aiFeatureOptions}
            />


            {/* Center label */}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-8">

              <div className="text-center">

                <p className="text-2xl font-bold tracking-tight text-white">
                  100%
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-slate-600">
                  Activity
                </p>

              </div>

            </div>

          </div>


          {/* Bottom summary */}

          <div className="mt-1 grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-4">

            <div>

              <p className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
                Most used
              </p>

              <p className="mt-1 text-sm font-semibold text-cyan-400">
                AI Chat
              </p>

            </div>


            <div className="text-right">

              <p className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
                Top share
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                35%
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsCharts;