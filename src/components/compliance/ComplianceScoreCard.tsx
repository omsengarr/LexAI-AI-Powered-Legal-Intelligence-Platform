interface ComplianceScoreCardProps {
  score: number;
}

function ComplianceScoreCard({
  score,
}: ComplianceScoreCardProps) {

  let color = "text-red-400";

  if (score >= 80) {
    color = "text-green-400";
  } else if (score >= 50) {
    color = "text-yellow-400";
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

      <h2 className="text-2xl font-bold text-white mb-4">
        Compliance Score
      </h2>

      <div className={`text-7xl font-bold ${color}`}>
        {score}%
      </div>

    </div>
  );
}

export default ComplianceScoreCard;