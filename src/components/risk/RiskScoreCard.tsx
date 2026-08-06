interface RiskScoreCardProps {
  score: number;
}

function RiskScoreCard({ score }: RiskScoreCardProps) {
  let color = "text-green-400";

  if (score >= 70) color = "text-red-400";
  else if (score >= 40) color = "text-yellow-400";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-lg">

      <h2 className="text-2xl font-bold text-white mb-4">
        Overall Risk Score
      </h2>

      <div className={`text-7xl font-bold ${color}`}>
        {score}
      </div>

      <p className="text-slate-400 mt-3">
        out of 100
      </p>

    </div>
  );
}

export default RiskScoreCard;