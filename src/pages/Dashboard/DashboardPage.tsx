import { useEffect, useState } from "react";

import DashboardCard from "../../components/dashboard/DashboardCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";

import {
  healthCheck,
  getDocumentCount,
} from "../../services/api";

import {
  FileText,
  Bot,
  Scale,
  AlertTriangle,
} from "lucide-react";

function DashboardPage() {
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    // Check backend connection
    healthCheck()
      .then((data) => {
        console.log("Backend connected:", data);
      })
      .catch((error) => {
        console.error("Backend connection failed:", error);
      });

    // Get document count from PostgreSQL
    getDocumentCount()
      .then((data) => {
        console.log("Document count:", data);
        setDocumentCount(data.count);
      })
      .catch((error) => {
        console.error("Failed to get document count:", error);
      });
  }, []);

  return (
    <>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-1">
          Welcome back. Here's your legal intelligence overview.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Documents"
          value={documentCount}
          icon={<FileText />}
          color="bg-cyan-500/20 text-cyan-400"
        />

        <DashboardCard
          title="AI Queries"
          value={560}
          icon={<Bot />}
          color="bg-purple-500/20 text-purple-400"
        />

        <DashboardCard
          title="Cases"
          value={89}
          icon={<Scale />}
          color="bg-green-500/20 text-green-400"
        />

        <DashboardCard
          title="Risk Alerts"
          value={37}
          icon={<AlertTriangle />}
          color="bg-red-500/20 text-red-400"
        />

      </div>

      {/* Recent Activity */}
      <RecentActivity />

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Quick Actions */}
      <QuickActions />
    </>
  );
}

export default DashboardPage;