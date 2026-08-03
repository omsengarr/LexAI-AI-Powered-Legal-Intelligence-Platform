import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

function DashboardCard({
  title,
  value,
  icon,
  color,
}: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
      }}
      transition={{
        duration: 0.25,
      }}
      className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-white mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`text-4xl p-4 rounded-xl ${color}`}
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
}

export default DashboardCard;