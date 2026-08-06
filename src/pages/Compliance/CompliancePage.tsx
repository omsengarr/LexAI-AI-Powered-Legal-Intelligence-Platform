import { useState } from "react";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import ComplianceScoreCard from "../../components/compliance/ComplianceScoreCard";
import ComplianceItem from "../../components/compliance/ComplianceItem";
import ComplianceSuggestion from "../../components/compliance/ComplianceSuggestion";

const complianceItems = [
  {
    title: "Data Processing Clause",
    status: true,
  },
  {
    title: "Consent Clause",
    status: true,
  },
  {
    title: "Confidentiality Clause",
    status: true,
  },
  {
    title: "Right to Erasure",
    status: false,
  },
  {
    title: "Data Retention Policy",
    status: false,
  },
];

function CompliancePage() {

  const [regulation, setRegulation] = useState("GDPR");

  return (
    <div className="flex min-h-screen bg-slate-950">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-8 space-y-8">

          <h1 className="text-3xl font-bold text-white">
            Compliance Checker
          </h1>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

            <label className="text-white font-semibold">
              Select Regulation
            </label>

            <select
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
              className="mt-4 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
            >
              <option>GDPR</option>
              <option>DPDP</option>
              <option>HIPAA</option>
            </select>

          </div>

          <ComplianceScoreCard score={87} />

          <div className="space-y-4">

            {complianceItems.map((item, index) => (
              <ComplianceItem
                key={index}
                title={item.title}
                status={item.status}
              />
            ))}

          </div>

          <ComplianceSuggestion
            suggestion="Add a Right to Erasure clause and a Data Retention Policy to improve compliance with GDPR requirements."
          />

        </main>

      </div>

    </div>
  );
}

export default CompliancePage;