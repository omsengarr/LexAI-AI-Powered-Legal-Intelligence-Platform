import { FaFileAlt, FaRobot, FaBalanceScale } from "react-icons/fa";

const activities = [
  {
    icon: <FaFileAlt />,
    title: "Contract.pdf uploaded",
    time: "5 minutes ago",
  },
  {
    icon: <FaRobot />,
    title: "AI summarized Supreme Court judgment",
    time: "20 minutes ago",
  },
  {
    icon: <FaBalanceScale />,
    title: "Compared two legal cases",
    time: "1 hour ago",
  },
  {
    icon: <FaRobot />,
    title: "Generated legal research report",
    time: "2 hours ago",
  },
];

function RecentActivity() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-slate-800 pb-4 last:border-none"
          >
            <div className="bg-cyan-500/20 text-cyan-400 p-3 rounded-xl text-xl">
              {activity.icon}
            </div>

            <div>
              <h3 className="text-white">
                {activity.title}
              </h3>

              <p className="text-slate-400 text-sm">
                {activity.time}
              </p>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default RecentActivity;