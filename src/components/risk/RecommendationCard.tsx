interface RecommendationCardProps {
  recommendation: string;
}

function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  return (
    <div className="bg-cyan-500/10 border border-cyan-500 rounded-xl p-5">

      <h3 className="text-cyan-400 font-bold mb-2">
        AI Recommendation
      </h3>

      <p className="text-slate-300">
        {recommendation}
      </p>

    </div>
  );
}

export default RecommendationCard;