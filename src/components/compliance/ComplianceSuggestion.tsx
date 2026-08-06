interface ComplianceSuggestionProps {
  suggestion: string;
}

function ComplianceSuggestion({
  suggestion,
}: ComplianceSuggestionProps) {
  return (
    <div className="bg-cyan-500/10 border border-cyan-500 rounded-xl p-5">

      <h3 className="text-cyan-400 font-bold mb-2">
        AI Suggestion
      </h3>

      <p className="text-slate-300">
        {suggestion}
      </p>

    </div>
  );
}

export default ComplianceSuggestion;