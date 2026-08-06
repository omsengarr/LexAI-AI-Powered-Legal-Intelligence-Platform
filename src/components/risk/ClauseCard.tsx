interface ClauseCardProps {
  clause: string;
  risk: string;
}

function ClauseCard({ clause, risk }: ClauseCardProps) {

  const colors = {
    High: "bg-red-500/20 text-red-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    Low: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">

      <div>
        <h3 className="text-white font-semibold">
          {clause}
        </h3>
      </div>

      <span
        className={`px-4 py-2 rounded-full text-sm ${
          colors[risk as keyof typeof colors]
        }`}
      >
        {risk} Risk
      </span>

    </div>
  );
}

export default ClauseCard;