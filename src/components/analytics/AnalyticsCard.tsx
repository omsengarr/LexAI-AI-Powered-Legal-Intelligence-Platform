import type { ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

function AnalyticsCard({
  title,
  value,
  icon,
}: AnalyticsCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-cyan-500 transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-white mt-2">
            {value}
          </h2>

        </div>

        <div className="text-4xl text-cyan-400">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default AnalyticsCard