import {
  FaFileAlt,
  FaRobot,
  FaBalanceScale,
  FaShieldAlt,
} from "react-icons/fa";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import DashboardCard from "../../components/dashboard/DashboardCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";

function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        <Topbar />

        <main className="p-8">

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            <DashboardCard
              title="Documents Uploaded"
              value="124"
              icon={<FaFileAlt />}
              color="bg-cyan-500/20 text-cyan-400"
            />

            <DashboardCard
              title="AI Queries"
              value="560"
              icon={<FaRobot />}
              color="bg-green-500/20 text-green-400"
            />

            <DashboardCard
              title="Cases Analyzed"
              value="89"
              icon={<FaBalanceScale />}
              color="bg-purple-500/20 text-purple-400"
            />

            <DashboardCard
              title="Risk Reports"
              value="37"
              icon={<FaShieldAlt />}
              color="bg-red-500/20 text-red-400"
            />

          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            <div className="xl:col-span-2">
              <RecentActivity />
            </div>

            <div>
              <QuickActions />
            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default DashboardPage;