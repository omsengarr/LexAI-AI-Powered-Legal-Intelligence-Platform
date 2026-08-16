import { useEffect, useState } from "react";

import {
  FileText,
  MessageSquare,
  Scale,
  Activity,
} from "lucide-react";

import AnalyticsCard from "../../components/analytics/AnalyticsCard";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";


function AnalyticsPage() {

  // ========================================
  // Analytics Statistics
  // ========================================

  const [documentCount, setDocumentCount] = useState(0);

  const [aiQueryCount, setAIQueryCount] = useState(0);

  const [caseCount, setCaseCount] = useState(0);

  const [loading, setLoading] = useState(true);


  // ========================================
  // Load Analytics Data
  // ========================================

  useEffect(() => {

    const fetchAnalyticsData = async () => {

      try {

        // ----------------------------------------
        // Documents
        // ----------------------------------------

        const documentResponse = await fetch(
          "http://127.0.0.1:8000/documents/count"
        );

        if (!documentResponse.ok) {
          throw new Error(
            "Failed to fetch document count"
          );
        }

        const documentData =
          await documentResponse.json();

        setDocumentCount(
          documentData.count
        );


        // ----------------------------------------
        // AI Queries
        // ----------------------------------------

        const queryResponse = await fetch(
          "http://127.0.0.1:8000/queries/count"
        );

        if (!queryResponse.ok) {
          throw new Error(
            "Failed to fetch AI query count"
          );
        }

        const queryData =
          await queryResponse.json();

        setAIQueryCount(
          queryData.count
        );


        // ----------------------------------------
        // Cases
        // ----------------------------------------

        const caseResponse = await fetch(
          "http://127.0.0.1:8000/cases/count"
        );

        if (!caseResponse.ok) {
          throw new Error(
            "Failed to fetch case count"
          );
        }

        const caseData =
          await caseResponse.json();

        setCaseCount(
          caseData.count
        );


      } catch (error) {

        console.error(
          "Failed to fetch analytics data:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchAnalyticsData();

  }, []);


  // ========================================
  // Loading State
  // ========================================

  if (loading) {

    return (
      <main className="p-8">

        <div className="flex items-center justify-center min-h-[400px]">

          <p className="text-slate-400 text-lg">
            Loading analytics...
          </p>

        </div>

      </main>
    );

  }


  // ========================================
  // Analytics UI
  // ========================================

  return (

    <main className="p-8 space-y-8">


      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Analytics
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor your legal intelligence platform
          activity and usage.
        </p>

      </div>


      {/* ========================================
          ANALYTICS STATISTICS
      ======================================== */}

      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        <AnalyticsCard
          title="Documents Processed"
          value={documentCount.toString()}
          icon={<FileText />}
        />


        <AnalyticsCard
          title="AI Queries"
          value={aiQueryCount.toString()}
          icon={<MessageSquare />}
        />


        <AnalyticsCard
          title="Legal Cases"
          value={caseCount.toString()}
          icon={<Scale />}
        />


        <AnalyticsCard
          title="System Activity"
          value="Active"
          icon={<Activity />}
        />

      </section>


      {/* ========================================
          ANALYTICS CHARTS
      ======================================== */}

      <section>

        <AnalyticsCharts />

      </section>


      {/* ========================================
          PLATFORM INSIGHTS
      ======================================== */}

      <section
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Platform Insights
            </h2>

            <p className="text-slate-400 mt-1">
              Current activity overview across LexAI.
            </p>

          </div>

          <Activity
            size={28}
            className="text-cyan-400"
          />

        </div>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            mt-6
          "
        >


          {/* ========================================
              DOCUMENT INSIGHT
          ======================================== */}

          <div
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-5
            "
          >

            <p className="text-slate-400 text-sm">
              Document Processing
            </p>

            <p className="text-white text-lg font-semibold mt-2">
              {documentCount} Documents
            </p>

            <p className="text-slate-500 text-sm mt-2">
              Documents currently tracked by LexAI.
            </p>

          </div>


          {/* ========================================
              AI INSIGHT
          ======================================== */}

          <div
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-5
            "
          >

            <p className="text-slate-400 text-sm">
              AI Assistant
            </p>

            <p className="text-white text-lg font-semibold mt-2">
              {aiQueryCount} Queries
            </p>

            <p className="text-slate-500 text-sm mt-2">
              AI queries recorded by the backend.
            </p>

          </div>


          {/* ========================================
              CASE INSIGHT
          ======================================== */}

          <div
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-5
            "
          >

            <p className="text-slate-400 text-sm">
              Case Intelligence
            </p>

            <p className="text-white text-lg font-semibold mt-2">
              {caseCount} Cases
            </p>

            <p className="text-slate-500 text-sm mt-2">
              Legal cases currently available for analysis.
            </p>

          </div>


        </div>

      </section>


    </main>

  );

}


export default AnalyticsPage;