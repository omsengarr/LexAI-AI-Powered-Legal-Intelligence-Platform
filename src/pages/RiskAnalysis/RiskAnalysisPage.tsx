import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import RiskScoreCard from "../../components/risk/RiskScoreCard";
import ClauseCard from "../../components/risk/ClauseCard";
import RecommendationCard from "../../components/risk/RecommendationCard";

const clauses = [
  { clause: "Termination Clause", risk: "High" },
  { clause: "Liability Clause", risk: "Medium" },
  { clause: "Payment Terms", risk: "Low" },
  { clause: "Confidentiality", risk: "Low" },
];

function RiskAnalysisPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-8 space-y-8">

          <h1 className="text-3xl font-bold text-white">
            AI Risk Analysis
          </h1>

          <RiskScoreCard score={78} />

          <div className="space-y-4">
            {clauses.map((item, index) => (
              <ClauseCard
                key={index}
                clause={item.clause}
                risk={item.risk}
              />
            ))}
          </div>

          <RecommendationCard
            recommendation="Add a 30-day notice period before termination, limit liability exposure, and clarify payment obligations to reduce contractual risk."
          />

        </main>

      </div>

    </div>
  );
}

export default RiskAnalysisPage;