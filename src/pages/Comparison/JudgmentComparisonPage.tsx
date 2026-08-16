import { useEffect, useState } from "react";
import {
  Scale,
  Search,
  ArrowLeftRight,
  FileText,
} from "lucide-react";

interface CaseItem {
  id: number;
  case_number: string;
  title: string;
  court: string | null;
  case_type: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
}

function JudgmentComparisonPage() {

  // ========================================
  // State
  // ========================================

  const [cases, setCases] = useState<CaseItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [leftCaseId, setLeftCaseId] = useState<number | null>(null);

  const [rightCaseId, setRightCaseId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ========================================
  // Fetch Cases
  // ========================================

  useEffect(() => {

    const fetchCases = async () => {

      try {

        setLoading(true);

        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/cases"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cases");
        }

        const data = await response.json();

        setCases(data);

      } catch (err) {

        console.error(
          "Failed to load cases:",
          err
        );

        setError(
          "Unable to load cases. Please make sure the backend is running."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchCases();

  }, []);


  // ========================================
  // Search
  // ========================================

  const filteredCases = cases.filter((item) => {

    const searchableText = `
      ${item.case_number}
      ${item.title}
      ${item.court ?? ""}
      ${item.case_type ?? ""}
      ${item.description ?? ""}
    `.toLowerCase();

    return searchableText.includes(
      searchQuery.toLowerCase()
    );

  });


  // ========================================
  // Selected Cases
  // ========================================

  const leftCase =
    cases.find(
      (item) => item.id === leftCaseId
    ) ?? null;


  const rightCase =
    cases.find(
      (item) => item.id === rightCaseId
    ) ?? null;


  // ========================================
  // Render
  // ========================================

  return (

    <main className="p-8 space-y-8">


      {/* ========================================
          HEADER
      ======================================== */}

      <section>

        <div className="flex items-center gap-4">

          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-cyan-500
              flex
              items-center
              justify-center
              text-white
              shadow-lg
            "
          >

            <Scale size={25} />

          </div>


          <div>

            <h1 className="text-3xl font-bold text-white">
              Judgment Comparison
            </h1>

            <p className="text-slate-400 mt-1">
              Compare two legal cases side by side.
            </p>

          </div>

        </div>

      </section>


      {/* ========================================
          SEARCH
      ======================================== */}

      <section
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
        "
      >

        <div className="relative">

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search cases by title, case number, court..."
            className="
              w-full
              bg-slate-950
              border
              border-slate-700
              rounded-xl
              px-5
              py-4
              pr-12
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:border-cyan-500
            "
          />


          <Search
            size={21}
            className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

        </div>

      </section>


      {/* ========================================
          ERROR
      ======================================== */}

      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            p-5
            text-red-300
          "
        >

          {error}

        </div>

      )}


      {/* ========================================
          LOADING
      ======================================== */}

      {loading ? (

        <div
          className="
            rounded-2xl
            bg-slate-900
            border
            border-slate-800
            p-10
            text-center
          "
        >

          <p className="text-slate-400">
            Loading cases...
          </p>

        </div>

      ) : (

        <>

          {/* ========================================
              CASE SELECTION
          ======================================== */}

          <section>

            <div className="flex items-center gap-3 mb-5">

              <FileText
                size={22}
                className="text-cyan-400"
              />

              <h2 className="text-xl font-semibold text-white">
                Select Cases
              </h2>

            </div>


            {filteredCases.length === 0 ? (

              <div
                className="
                  rounded-2xl
                  bg-slate-900
                  border
                  border-slate-800
                  p-8
                  text-center
                "
              >

                <p className="text-slate-400">
                  No cases found.
                </p>

              </div>

            ) : (

              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-5
                "
              >

                {filteredCases.map((item) => (

                  <div
                    key={item.id}
                    className="
                      bg-slate-900
                      border
                      border-slate-800
                      rounded-2xl
                      p-6
                      hover:border-cyan-500/50
                      transition
                    "
                  >

                    <div className="flex justify-between gap-4">

                      <div>

                        <p className="text-cyan-400 text-sm font-medium">
                          {item.case_number}
                        </p>

                        <h3 className="text-xl font-bold text-white mt-2">
                          {item.title}
                        </h3>

                      </div>

                      <span
                        className="
                          h-fit
                          px-3
                          py-1
                          rounded-full
                          bg-slate-800
                          text-slate-300
                          text-xs
                        "
                      >
                        {item.status ?? "Unknown"}
                      </span>

                    </div>


                    <div className="mt-4 space-y-2">

                      <p className="text-slate-400 text-sm">
                        Court:{" "}
                        <span className="text-slate-300">
                          {item.court ?? "Not available"}
                        </span>
                      </p>

                      <p className="text-slate-400 text-sm">
                        Type:{" "}
                        <span className="text-slate-300">
                          {item.case_type ?? "Not available"}
                        </span>
                      </p>

                    </div>


                    <div className="flex gap-3 mt-6">

                      <button
                        type="button"
                        onClick={() =>
                          setLeftCaseId(item.id)
                        }
                        className={`
                          flex-1
                          px-4
                          py-3
                          rounded-xl
                          font-semibold
                          transition
                          ${
                            leftCaseId === item.id
                              ? "bg-cyan-500 text-white"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }
                        `}
                      >
                        {leftCaseId === item.id
                          ? "Selected as Case 1"
                          : "Select Case 1"}
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          setRightCaseId(item.id)
                        }
                        className={`
                          flex-1
                          px-4
                          py-3
                          rounded-xl
                          font-semibold
                          transition
                          ${
                            rightCaseId === item.id
                              ? "bg-cyan-500 text-white"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }
                        `}
                      >
                        {rightCaseId === item.id
                          ? "Selected as Case 2"
                          : "Select Case 2"}
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* ========================================
              COMPARISON
          ======================================== */}

          <section>

            <div className="flex items-center gap-3 mb-5">

              <ArrowLeftRight
                size={22}
                className="text-cyan-400"
              />

              <h2 className="text-xl font-semibold text-white">
                Case Comparison
              </h2>

            </div>


            {!leftCase || !rightCase ? (

              <div
                className="
                  rounded-2xl
                  bg-slate-900
                  border
                  border-slate-800
                  p-10
                  text-center
                "
              >

                <Scale
                  size={40}
                  className="
                    mx-auto
                    text-slate-600
                    mb-4
                  "
                />

                <h3 className="text-lg font-semibold text-white">
                  Select two cases to compare
                </h3>

                <p className="text-slate-500 mt-2">
                  Choose Case 1 and Case 2 above to view
                  their details side by side.
                </p>

              </div>

            ) : (

              <div
                className="
                  grid
                  grid-cols-1
                  xl:grid-cols-2
                  gap-6
                "
              >

                {/* ========================================
                    CASE 1
                ======================================== */}

                <div
                  className="
                    bg-slate-900
                    border
                    border-cyan-500/30
                    rounded-2xl
                    p-6
                  "
                >

                  <div className="flex items-center gap-3 mb-6">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        bg-cyan-500/10
                        text-cyan-400
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >
                      1
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {leftCase.title}
                    </h3>

                  </div>


                  <div className="space-y-5">

                    <div>

                      <p className="text-slate-500 text-sm">
                        Case Number
                      </p>

                      <p className="text-white mt-1">
                        {leftCase.case_number}
                      </p>

                    </div>


                    <div>

                      <p className="text-slate-500 text-sm">
                        Court
                      </p>

                      <p className="text-white mt-1">
                        {leftCase.court ?? "Not available"}
                      </p>

                    </div>


                    <div>

                      <p className="text-slate-500 text-sm">
                        Case Type
                      </p>

                      <p className="text-white mt-1">
                        {leftCase.case_type ?? "Not available"}
                      </p>

                    </div>


                    <div>

                      <p className="text-slate-500 text-sm">
                        Status
                      </p>

                      <p className="text-white mt-1">
                        {leftCase.status ?? "Not available"}
                      </p>

                    </div>


                    <div>

                      <p className="text-slate-500 text-sm">
                        Description
                      </p>

                      <p className="text-slate-300 mt-1 leading-relaxed">
                        {leftCase.description ??
                          "No description available."}
                      </p>

                    </div>

                  </div>

                </div>


                {/* ========================================
                    CASE 2
                ======================================== */}

                <div
                  className="
                    bg-slate-900
                    border
                    border-purple-500/30
                    rounded-2xl
                    p-6
                  "
                >

                  <div className="flex items-center gap-3 mb-6">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        bg-purple-500/10
                        text-purple-400
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >
                      2
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {rightCase.title}
                    </h3>

                  </div>


                  <div className="space-y-5">

                    <div>

                      <p className="text-slate-500 text-sm">
                        Case Number
                      </p>

                      <p className="text-white mt-1">
                        {rightCase.case_number}
                      </p>

                    </div>


                    <div>

                      <p className="text-slate-500 text-sm">
                        Court
                      </p>

                      <p className="text-white mt-1">
                        {rightCase.court ?? "Not available"}
                      </p>

                    </div>


                    <div>

                      <p className="text-slate-500 text-sm">
                        Case Type
                      </p>

                      <p className="text-white mt-1">
                        {rightCase.case_type ?? "Not available"}
                      </p>

                    </div>


                    <div>

                      <p className="text-slate-500 text-sm">
                        Status
                      </p>

                      <p className="text-white mt-1">
                        {rightCase.status ?? "Not available"}
                      </p>

                    </div>


                    <div>

                      <p className="text-slate-500 text-sm">
                        Description
                      </p>

                      <p className="text-slate-300 mt-1 leading-relaxed">
                        {rightCase.description ??
                          "No description available."}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            )}

          </section>

        </>

      )}

    </main>

  );

}

export default JudgmentComparisonPage;