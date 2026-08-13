import { useEffect, useState } from "react";

import DashboardCard from "../../components/dashboard/DashboardCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";

import {
  healthCheck,
  getDocumentCount,
  getAIQueryCount,
} from "../../services/api";

import {
  FileText,
  Bot,
  Scale,
  AlertTriangle,
  Activity,
  ShieldCheck,
} from "lucide-react";


function DashboardPage() {

  // ========================================
  // Dashboard Statistics
  // ========================================

  const [documentCount, setDocumentCount] = useState(0);

  const [aiQueryCount, setAIQueryCount] = useState(0);


  // ========================================
  // Load Dashboard Data
  // ========================================

  useEffect(() => {

    // ----------------------------------------
    // Backend Health Check
    // ----------------------------------------

    healthCheck()
      .then((data) => {
        console.log("Backend connected:", data);
      })
      .catch((error) => {
        console.error(
          "Backend connection failed:",
          error
        );
      });


    // ----------------------------------------
    // Get Document Count
    // ----------------------------------------

    getDocumentCount()
      .then((data) => {

        console.log(
          "Document count:",
          data
        );

        setDocumentCount(data.count);

      })
      .catch((error) => {

        console.error(
          "Failed to get document count:",
          error
        );

      });


    // ----------------------------------------
    // Get AI Query Count
    // ----------------------------------------

    getAIQueryCount()
      .then((data) => {

        console.log(
          "AI query count:",
          data
        );

        setAIQueryCount(data.count);

      })
      .catch((error) => {

        console.error(
          "Failed to get AI query count:",
          error
        );

      });

  }, []);


  // ========================================
  // Dashboard UI
  // ========================================

  return (
    <div className="space-y-8">

      {/* ========================================
          Dashboard Header
      ======================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          via-slate-900
          to-cyan-950/30
          p-6
          md:p-8
        "
      >

        {/* Background Decoration */}

        <div
          className="
            absolute
            -right-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-20
            right-32
            h-40
            w-40
            rounded-full
            bg-purple-500/10
            blur-3xl
          "
        />


        {/* Header Content */}

        <div className="relative">

          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* Title */}

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-500/10
                    text-cyan-400
                    border
                    border-cyan-500/20
                  "
                >
                  <ShieldCheck size={22} />
                </div>

                <span
                  className="
                    text-sm
                    font-medium
                    text-cyan-400
                    uppercase
                    tracking-wider
                  "
                >
                  Legal Intelligence Center
                </span>

              </div>


              <h1
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Dashboard
              </h1>


              <p
                className="
                  mt-2
                  max-w-2xl
                  text-slate-400
                "
              >
                Welcome back. Monitor your legal
                documents, AI activity, cases and
                risk intelligence from one place.
              </p>

            </div>


            {/* System Status */}

            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-800
                bg-slate-950/60
                px-4
                py-3
                shrink-0
              "
            >

              <div className="relative">

                <span
                  className="
                    block
                    h-3
                    w-3
                    rounded-full
                    bg-green-400
                  "
                />

                <span
                  className="
                    absolute
                    inset-0
                    h-3
                    w-3
                    rounded-full
                    bg-green-400
                    animate-ping
                    opacity-50
                  "
                />

              </div>


              <div>

                <p className="text-sm font-medium text-white">
                  System Operational
                </p>

                <p className="text-xs text-slate-500">
                  Backend connection active
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          Statistics Section
      ======================================== */}

      <section>

        <div
          className="
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-end
            sm:justify-between
            mb-5
          "
        >

          <div>

            <h2 className="text-lg font-semibold text-white">
              Intelligence Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current activity across your LexAI workspace.
            </p>

          </div>


          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-slate-500
            "
          >

            <Activity size={15} />

            Live data

          </div>

        </div>


        {/* Statistics Cards */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >

          {/* Documents */}

          <DashboardCard
            title="Documents"
            value={documentCount}
            icon={<FileText />}
            color="bg-cyan-500/20 text-cyan-400"
          />


          {/* AI Queries */}

          <DashboardCard
            title="AI Queries"
            value={aiQueryCount}
            icon={<Bot />}
            color="bg-purple-500/20 text-purple-400"
          />


          {/* Cases */}

          <DashboardCard
            title="Cases"
            value={89}
            icon={<Scale />}
            color="bg-green-500/20 text-green-400"
          />


          {/* Risk Alerts */}

          <DashboardCard
            title="Risk Alerts"
            value={37}
            icon={<AlertTriangle />}
            color="bg-red-500/20 text-red-400"
          />

        </div>

      </section>


      {/* ========================================
          Recent Activity
      ======================================== */}

      <section>

        <RecentActivity />

      </section>


      {/* ========================================
          Analytics
      ======================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-white">
            Analytics
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Review trends and activity across your legal workspace.
          </p>

        </div>

        <AnalyticsCharts />

      </section>


      {/* ========================================
          Quick Actions
      ======================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-white">
            Quick Actions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Access your most frequently used legal intelligence tools.
          </p>

        </div>

        <QuickActions />

      </section>


      {/* ========================================
          Dashboard Footer
      ======================================== */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-t
          border-slate-800
          pt-6
          pb-2
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <p className="text-xs text-slate-600">
          LexAI • AI-Powered Legal Intelligence Platform
        </p>

        <p className="text-xs text-slate-600">
          Legal intelligence workspace
        </p>

      </div>

    </div>
  );
}


export default DashboardPage;