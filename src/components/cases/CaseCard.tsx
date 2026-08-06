interface CaseCardProps {
  title: string;
  court: string;
  date: string;
  summary: string;
}

function CaseCard({
  title,
  court,
  date,
  summary,
}: CaseCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-cyan-500 transition">

      <h2 className="text-2xl font-semibold text-white">
        {title}
      </h2>

      <div className="mt-3 flex gap-6 text-slate-400 text-sm">
        <span>{court}</span>
        <span>{date}</span>
      </div>

      <p className="text-slate-300 mt-5 leading-7">
        {summary}
      </p>

      <button className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-xl text-white transition">
        View Details
      </button>

    </div>
  );
}

export default CaseCard;