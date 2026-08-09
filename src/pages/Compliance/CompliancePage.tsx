import { useState } from "react";

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
    <main className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Compliance Checker
        </h1>

        <p className="text-slate-400 mt-2">
          Check your legal documents against important regulatory
          requirements.
        </p>
      </div>

      {/* Regulation Selection */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <label className="text-white font-semibold">
          Select Regulation
        </label>

        <select
          value={regulation}
          onChange={(e) => setRegulation(e.target.value)}
          className="
            mt-4
            w-full
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            p-3
            text-white
            focus:outline-none
            focus:border-cyan-500
          "
        >
          <option value="GDPR">GDPR</option>
          <option value="DPDP">DPDP</option>
          <option value="HIPAA">HIPAA</option>
        </select>
      </div>

      {/* Compliance Score */}
      <ComplianceScoreCard score={87} />

      {/* Compliance Items */}
      <div className="space-y-4">
        {complianceItems.map((item, index) => (
          <ComplianceItem
            key={index}
            title={item.title}
            status={item.status}
          />
        ))}
      </div>

      {/* Suggestions */}
      <ComplianceSuggestion
        suggestion={`Add a Right to Erasure clause and a Data Retention Policy to improve compliance with ${regulation} requirements.`}
      />
    </main>
  );
}

export default CompliancePage;