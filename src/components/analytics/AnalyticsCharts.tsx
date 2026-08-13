import {
  Line,
  Doughnut,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
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

      borderColor: "#0f172a",

      borderWidth: 2,
    },
  ],
};


// ==========================================
// WEEKLY UPLOAD OPTIONS
// ==========================================

const weeklyUploadOptions = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "top" as const,

      labels: {
        color: "#64748b",

        boxWidth: 40,

        padding: 15,
      },
    },

    tooltip: {
      enabled: true,
    },
  },

  scales: {
    x: {
      grid: {
        color: "rgba(51, 65, 85, 0.18)",
      },

      ticks: {
        color: "#64748b",
      },
    },

    y: {
      beginAtZero: false,

      grid: {
        color: "rgba(51, 65, 85, 0.18)",
      },

      ticks: {
        color: "#64748b",
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
      position: "top" as const,

      labels: {
        color: "#64748b",

        padding: 12,
      },
    },

    tooltip: {
      enabled: true,
    },
  },

  cutout: "55%",
};


// ==========================================
// ANALYTICS COMPONENT
// ==========================================

function AnalyticsCharts() {

  return (
    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        items-stretch
      "
    >

      {/* ====================================== */}
      {/* WEEKLY UPLOAD TREND */}
      {/* ====================================== */}

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
          min-h-[420px]
        "
      >

        <h3
          className="
            text-xl
            font-semibold
            text-white
            mb-5
          "
        >
          Weekly Upload Trend
        </h3>


        <div className="h-[320px]">

          <Line
            data={weeklyUploadData}
            options={weeklyUploadOptions}
          />

        </div>

      </div>


      {/* ====================================== */}
      {/* AI FEATURE USAGE */}
      {/* ====================================== */}

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
          min-h-[420px]
        "
      >

        <h3
          className="
            text-xl
            font-semibold
            text-white
            mb-5
          "
        >
          AI Feature Usage
        </h3>


        <div className="h-[320px]">

          <Doughnut
            data={aiFeatureData}
            options={aiFeatureOptions}
          />

        </div>

      </div>

    </div>
  );
}


export default AnalyticsCharts;