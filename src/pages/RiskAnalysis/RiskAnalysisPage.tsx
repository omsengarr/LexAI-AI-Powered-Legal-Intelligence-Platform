import RiskScoreCard from "../../components/risk/RiskScoreCard";
import ClauseCard from "../../components/risk/ClauseCard";
import RecommendationCard from "../../components/risk/RecommendationCard";

const clauses = [
  {
    clause: "Termination Clause",
    risk: "High",
  },
  {
    clause: "Liability Clause",
    risk: "Medium",
  },
  {
    clause: "Payment Terms",
    risk: "Low",
  },
  {
    clause: "Confidentiality",
    risk: "Low",
  },
];

function RiskAnalysisPage() {
  return (
    <main className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          AI Risk Analysis
        </h1>

        <p className="text-slate-400 mt-2">
          Analyze your legal documents and identify potential contractual risks.
        </p>
      </div>

      {/* Risk Score */}
      <RiskScoreCard score={78} />

      {/* Risk Clauses */}
      <div className="space-y-4">
        {clauses.map((item, index) => (
          <ClauseCard
            key={index}
            clause={item.clause}
            risk={item.risk}
          />
        ))}
      </div>

      {/* Recommendations */}
      <RecommendationCard
        recommendation="Add a 30-day notice period before termination, limit liability exposure, and clarify payment obligations to reduce contractual risk."
      />
    </main>
  );
}

export default RiskAnalysisPage;