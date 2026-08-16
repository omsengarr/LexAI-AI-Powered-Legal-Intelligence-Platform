import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Loader2,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";

// ========================================
// Case Interface
// ========================================

interface LegalCase {
  id: number;
  case_number: string;
  title: string;
  court: string | null;
  case_type: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
}

// ========================================
// Case Search Page
// ========================================

function CaseSearchPage() {
  const navigate = useNavigate();

  // ========================================
  // State
  // ========================================

  const [cases, setCases] = useState<LegalCase[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [creating, setCreating] = useState(false);

  const [createError, setCreateError] = useState("");

  const [createSuccess, setCreateSuccess] = useState("");

  // ========================================
  // New Case Form State
  // ========================================

  const [caseNumber, setCaseNumber] = useState("");

  const [title, setTitle] = useState("");

  const [court, setCourt] = useState("");

  const [caseType, setCaseType] = useState("");

  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("Active");

  // ========================================
  // Load Cases
  // ========================================

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/cases"
      );

      if (!response.ok) {
        throw new Error("Failed to load cases.");
      }

      const data: LegalCase[] = await response.json();

      setCases(data);
    } catch (error) {
      console.error(
        "Failed to fetch cases:",
        error
      );

      setError(
        "Unable to load cases. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // ========================================
  // Create New Case
  // ========================================

  const handleCreateCase = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setCreateError("");
    setCreateSuccess("");

    if (!caseNumber.trim() || !title.trim()) {
      setCreateError(
        "Case number and title are required."
      );

      return;
    }

    try {
      setCreating(true);

      const params = new URLSearchParams();

      params.append(
        "case_number",
        caseNumber.trim()
      );

      params.append(
        "title",
        title.trim()
      );

      params.append(
        "court",
        court.trim()
      );

      params.append(
        "case_type",
        caseType.trim()
      );

      params.append(
        "description",
        description.trim()
      );

      params.append(
        "status",
        status
      );

      const response = await fetch(
        `http://127.0.0.1:8000/cases?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to create case."
        );
      }

      setCreateSuccess(
        "Case created successfully."
      );

      // Clear form

      setCaseNumber("");
      setTitle("");
      setCourt("");
      setCaseType("");
      setDescription("");
      setStatus("Active");

      // Reload cases

      await fetchCases();

      // Close form after short delay

      setTimeout(() => {
        setShowCreateForm(false);
        setCreateSuccess("");
      }, 1200);
    } catch (error) {
      console.error(
        "Failed to create case:",
        error
      );

      setCreateError(
        error instanceof Error
          ? error.message
          : "Failed to create case."
      );
    } finally {
      setCreating(false);
    }
  };

  // ========================================
  // Search Cases
  // ========================================

  const filteredCases =
    cases.filter((item) => {
      const searchText =
        `${item.case_number}
        ${item.title}
        ${item.court ?? ""}
        ${item.case_type ?? ""}
        ${item.description ?? ""}
        ${item.status ?? ""}`.toLowerCase();

      return searchText.includes(
        searchQuery.toLowerCase()
      );
    });

  // ========================================
  // Page
  // ========================================

  return (
    <main className="space-y-8">

      {/* ========================================
          Page Header
      ======================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Case Search
          </h1>

          <p className="text-slate-400 mt-2">
            Search and explore legal cases and judgments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowCreateForm(true);
            setCreateError("");
            setCreateSuccess("");
          }}
          className="
            flex
            items-center
            justify-center
            gap-2
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
          <Plus size={20} />

          Add New Case
        </button>

      </div>


      {/* ========================================
          Create Case Form
      ======================================== */}

      {showCreateForm && (

        <section
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
            md:p-8
          "
        >

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-white">
                Create New Case
              </h2>

              <p className="text-slate-400 mt-1">
                Add a new legal case to the LexAI database.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowCreateForm(false)
              }
              className="
                p-2
                rounded-lg
                text-slate-400
                hover:text-white
                hover:bg-slate-800
                transition
              "
            >
              <X size={22} />
            </button>

          </div>


          {/* Create Error */}

          {createError && (

            <div
              className="
                flex
                items-center
                gap-3
                bg-red-500/10
                border
                border-red-500/30
                rounded-xl
                p-4
                mb-6
              "
            >

              <AlertCircle
                size={20}
                className="text-red-400"
              />

              <p className="text-red-400 text-sm">
                {createError}
              </p>

            </div>

          )}


          {/* Create Success */}

          {createSuccess && (

            <div
              className="
                bg-green-500/10
                border
                border-green-500/30
                rounded-xl
                p-4
                mb-6
              "
            >

              <p className="text-green-400 text-sm">
                {createSuccess}
              </p>

            </div>

          )}


          <form
            onSubmit={handleCreateCase}
            className="space-y-6"
          >

            {/* Row 1 */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Case Number */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Case Number *
                </label>

                <input
                  type="text"
                  value={caseNumber}
                  onChange={(event) =>
                    setCaseNumber(
                      event.target.value
                    )
                  }
                  placeholder="LEX-2026-007"
                  className="
                    w-full
                    bg-slate-950
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    placeholder:text-slate-600
                    focus:outline-none
                    focus:border-cyan-500
                  "
                />

              </div>


              {/* Title */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Case Title *
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="ABC Technologies vs XYZ Solutions"
                  className="
                    w-full
                    bg-slate-950
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    placeholder:text-slate-600
                    focus:outline-none
                    focus:border-cyan-500
                  "
                />

              </div>

            </div>


            {/* Row 2 */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Court */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Court
                </label>

                <input
                  type="text"
                  value={court}
                  onChange={(event) =>
                    setCourt(
                      event.target.value
                    )
                  }
                  placeholder="Delhi High Court"
                  className="
                    w-full
                    bg-slate-950
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    placeholder:text-slate-600
                    focus:outline-none
                    focus:border-cyan-500
                  "
                />

              </div>


              {/* Case Type */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Case Type
                </label>

                <input
                  type="text"
                  value={caseType}
                  onChange={(event) =>
                    setCaseType(
                      event.target.value
                    )
                  }
                  placeholder="Civil"
                  className="
                    w-full
                    bg-slate-950
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    placeholder:text-slate-600
                    focus:outline-none
                    focus:border-cyan-500
                  "
                />

              </div>

            </div>


            {/* Status */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                className="
                  w-full
                  bg-slate-950
                  border
                  border-slate-700
                  rounded-xl
                  px-4
                  py-3
                  text-white
                  focus:outline-none
                  focus:border-cyan-500
                "
              >

                <option value="Active">
                  Active
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Closed">
                  Closed
                </option>

              </select>

            </div>


            {/* Description */}

            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Enter a brief description of the case..."
                rows={5}
                className="
                  w-full
                  bg-slate-950
                  border
                  border-slate-700
                  rounded-xl
                  px-4
                  py-3
                  text-white
                  placeholder:text-slate-600
                  focus:outline-none
                  focus:border-cyan-500
                  resize-none
                "
              />

            </div>


            {/* Buttons */}

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="submit"
                disabled={creating}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  py-3
                  rounded-xl
                  bg-cyan-500
                  hover:bg-cyan-400
                  disabled:bg-slate-700
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  transition
                "
              >

                {creating ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />

                    Create Case
                  </>
                )}

              </button>


              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(false)
                }
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-slate-800
                  hover:bg-slate-700
                  text-slate-300
                  font-semibold
                  transition
                "
              >
                Cancel
              </button>

            </div>

          </form>

        </section>

      )}


      {/* ========================================
          Search Box
      ======================================== */}

      <div className="relative">

        <input
          type="text"
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(
              event.target.value
            )
          }
          placeholder="Search by case number, title, court or case type..."
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


      {/* ========================================
          Loading
      ======================================== */}

      {loading && (

        <div
          className="
            flex
            items-center
            justify-center
            gap-3
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-10
          "
        >

          <Loader2
            size={24}
            className="
              animate-spin
              text-cyan-400
            "
          />

          <p className="text-slate-400">
            Loading legal cases...
          </p>

        </div>

      )}


      {/* ========================================
          Error
      ======================================== */}

      {!loading && error && (

        <div
          className="
            flex
            items-center
            gap-3
            bg-red-500/10
            border
            border-red-500/30
            rounded-2xl
            p-6
          "
        >

          <AlertCircle
            size={24}
            className="text-red-400"
          />

          <p className="text-red-400">
            {error}
          </p>

        </div>

      )}


      {/* ========================================
          Results
      ======================================== */}

      {!loading && !error && (

        <div className="space-y-6">

          {/* Result Count */}

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-500">

              Showing{" "}

              <span className="text-slate-300 font-medium">
                {filteredCases.length}
              </span>{" "}

              {filteredCases.length === 1
                ? "case"
                : "cases"}

            </p>

          </div>


          {/* Case Cards */}

          {filteredCases.length > 0 ? (

            filteredCases.map((item) => (

              <div
                key={item.id}
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

                {/* Case Number */}

                <div className="flex flex-wrap items-center gap-3">

                  <span
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-cyan-400
                      bg-cyan-500/10
                      border
                      border-cyan-500/20
                      px-3
                      py-1.5
                      rounded-full
                    "
                  >
                    {item.case_number}
                  </span>


                  {/* Status */}

                  {item.status && (

                    <span
                      className="
                        text-xs
                        font-medium
                        text-green-400
                        bg-green-500/10
                        border
                        border-green-500/20
                        px-3
                        py-1.5
                        rounded-full
                      "
                    >
                      {item.status}
                    </span>

                  )}

                </div>


                {/* Title */}

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-white
                    mt-4
                  "
                >
                  {item.title}
                </h2>


                {/* Case Information */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-x-6
                    gap-y-2
                    mt-3
                  "
                >

                  {item.court && (

                    <span className="text-slate-400">
                      Court: {item.court}
                    </span>

                  )}


                  {item.case_type && (

                    <span className="text-slate-500">
                      Type: {item.case_type}
                    </span>

                  )}

                </div>


                {/* Description */}

                {item.description && (

                  <p
                    className="
                      text-slate-300
                      mt-6
                      leading-relaxed
                    "
                  >
                    {item.description}
                  </p>

                )}


                {/* View Details */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/cases/${item.id}`
                    )
                  }
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

                {searchQuery
                  ? `No cases found for "${searchQuery}".`
                  : "No cases available."}

              </p>

            </div>

          )}

        </div>

      )}

    </main>
  );
}

export default CaseSearchPage;