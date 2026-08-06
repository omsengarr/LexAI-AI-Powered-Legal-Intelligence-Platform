import { useState } from "react";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import SearchBar from "../../components/cases/SearchBar";
import CaseCard from "../../components/cases/CaseCard";

const dummyCases = [
  {
    title: "ABC Pvt Ltd vs XYZ Corporation",
    court: "Supreme Court of India",
    date: "12 Jan 2025",
    summary:
      "This case deals with a contractual dispute involving breach of agreement and compensation.",
  },
  {
    title: "State vs Rahul Sharma",
    court: "Delhi High Court",
    date: "08 Aug 2024",
    summary:
      "A criminal appeal involving evidence evaluation and sentencing guidelines.",
  },
];

function CaseSearchPage() {
  const [search, setSearch] = useState("");

  const filteredCases = dummyCases.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">

          <h1 className="text-3xl font-bold text-white mb-8">
            Case Search
          </h1>

          <SearchBar
            value={search}
            onChange={setSearch}
          />

          <div className="space-y-6 mt-8">

            {filteredCases.map((item, index) => (
              <CaseCard
                key={index}
                title={item.title}
                court={item.court}
                date={item.date}
                summary={item.summary}
              />
            ))}

            {filteredCases.length === 0 && (
              <div className="text-center text-slate-400 py-20">
                No matching cases found.
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}

export default CaseSearchPage;