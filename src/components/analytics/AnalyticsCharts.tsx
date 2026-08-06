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

import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);


const lineData = {
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
        11
      ],

      borderColor: "#22d3ee",

      backgroundColor:
        "rgba(34,211,238,0.2)",

      tension: 0.4,
    },
  ],
};


const doughnutData = {

  labels: [
    "AI Chat",
    "Case Search",
    "Risk Analysis",
    "Compliance",
  ],

  datasets: [

    {
      data:[
        35,
        25,
        20,
        20
      ],

      backgroundColor:[
        "#06b6d4",
        "#8b5cf6",
        "#22c55e",
        "#ef4444",
      ],

    },

  ],

};


function AnalyticsCharts(){

return (

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


<div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

<h2 className="text-white text-xl font-semibold mb-6">
Weekly Upload Trend
</h2>


<Line data={lineData}/>


</div>



<div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

<h2 className="text-white text-xl font-semibold mb-6">
AI Feature Usage
</h2>


<Doughnut data={doughnutData}/>


</div>


</div>

);

}


export default AnalyticsCharts;