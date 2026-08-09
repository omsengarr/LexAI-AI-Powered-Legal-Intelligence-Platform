import { useState } from "react";
import { Search } from "lucide-react";

const cases = [
  {
    title: "ABC Pvt Ltd vs XYZ Corporation",
    court: "Supreme Court of India",
    date: "12 Jan 2025",
    description:
      "This case deals with a contractual dispute involving breach of agreement and compensation.",
  },
  {
    title: "State vs Rahul Sharma",
    court: "Delhi High Court",
    date: "08 Aug 2024",
    description:
      "A criminal appeal involving evidence evaluation and sentencing guidelines.",
  },
];

function CaseSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCases = cases.filter((item) =>
    `${item.title} ${item.court} ${item.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Case Search
        </h1>

        <p className="text-slate-400 mt-2">
          Search and explore legal cases and judgments.
        </p>
      </div>

      {/* Search Box */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search legal cases..."
          className="
            w-full
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-5
            py-4
            pr-14
            text-white
            placeholder:text-slate-500
            focus:outline-none
            focus:border-cyan-500
            transition
          "
        />

        <Search
          size={22}
          className="
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        {filteredCases.length > 0 ? (
          filteredCases.map((item, index) => (
            <div
              key={index}
              className="
                bg-slate-900
                rounded-2xl
                border
                border-slate-800
                p-6
                hover:border-cyan-500/50
                transition
              "
            >
              <h2 className="text-2xl font-bold text-white">
                {item.title}
              </h2>

              <div className="flex items-center gap-6 mt-3">
                <span className="text-slate-400">
                  {item.court}
                </span>

                <span className="text-slate-500">
                  {item.date}
                </span>
              </div>

              <p className="text-slate-300 mt-6 leading-relaxed">
                {item.description}
              </p>

              <button
                type="button"
                className="
                  mt-6
                  px-5
                  py-3
                  rounded-xl
                  bg-cyan-500
                  hover:bg-cyan-400
                  text-white
                  font-semibold
                  transition
                "
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-8
              text-center
            "
          >
            <p className="text-slate-400">
              No cases found for "{searchQuery}".
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default CaseSearchPage;