import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Edit,
  X,
  Save,
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
// Case Details Page
// ========================================

function CaseDetailsPage() {
  const { caseId } = useParams();

  const navigate = useNavigate();

  // ========================================
  // State
  // ========================================

  const [legalCase, setLegalCase] =
    useState<LegalCase | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  const [saveSuccess, setSaveSuccess] =
    useState("");

  // ========================================
  // Edit Form State
  // ========================================

  const [caseNumber, setCaseNumber] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [court, setCourt] =
    useState("");

  const [caseType, setCaseType] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("Active");

  // ========================================
  // Load Case
  // ========================================

  const fetchCase = async () => {
    try {
      setLoading(true);
      setError("");

      if (!caseId) {
        throw new Error("Case ID is missing.");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/cases/${caseId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Case not found.");
        }

        throw new Error(
          "Failed to load case details."
        );
      }

      const data: LegalCase =
        await response.json();

      setLegalCase(data);

      // Fill edit form

      setCaseNumber(data.case_number);
      setTitle(data.title);
      setCourt(data.court || "");
      setCaseType(data.case_type || "");
      setDescription(data.description || "");
      setStatus(data.status || "Active");

    } catch (error) {
      console.error(
        "Failed to fetch case:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load case details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  // ========================================
  // Start Editing
  // ========================================

  const handleStartEditing = () => {
    if (!legalCase) {
      return;
    }

    setCaseNumber(legalCase.case_number);
    setTitle(legalCase.title);
    setCourt(legalCase.court || "");
    setCaseType(legalCase.case_type || "");
    setDescription(legalCase.description || "");
    setStatus(legalCase.status || "Active");

    setSaveError("");
    setSaveSuccess("");

    setEditing(true);
  };

  // ========================================
  // Cancel Editing
  // ========================================

  const handleCancelEditing = () => {
    if (legalCase) {
      setCaseNumber(legalCase.case_number);
      setTitle(legalCase.title);
      setCourt(legalCase.court || "");
      setCaseType(legalCase.case_type || "");
      setDescription(legalCase.description || "");
      setStatus(legalCase.status || "Active");
    }

    setSaveError("");
    setSaveSuccess("");
    setEditing(false);
  };

  // ========================================
  // Save Case
  // ========================================

  const handleSaveCase = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setSaveError("");
    setSaveSuccess("");

    if (!caseNumber.trim() || !title.trim()) {
      setSaveError(
        "Case number and title are required."
      );

      return;
    }

    if (!caseId) {
      setSaveError("Case ID is missing.");

      return;
    }

    try {
      setSaving(true);

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
        `http://127.0.0.1:8000/cases/${caseId}?${params.toString()}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update case."
        );
      }

      setLegalCase(data);

      // Update form with returned data

      setCaseNumber(data.case_number);
      setTitle(data.title);
      setCourt(data.court || "");
      setCaseType(data.case_type || "");
      setDescription(data.description || "");
      setStatus(data.status || "Active");

      setSaveSuccess(
        "Case updated successfully."
      );

      // Close edit mode after short delay

      setTimeout(() => {
        setEditing(false);
        setSaveSuccess("");
      }, 1200);

    } catch (error) {
      console.error(
        "Failed to update case:",
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to update case."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <main className="space-y-8">

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
            p-12
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
            Loading case details...
          </p>

        </div>

      </main>
    );
  }

  // ========================================
  // Error
  // ========================================

  if (error || !legalCase) {
    return (
      <main className="space-y-8">

        <button
          type="button"
          onClick={() => navigate("/cases")}
          className="
            inline-flex
            items-center
            gap-2
            text-slate-400
            hover:text-white
            transition
          "
        >

          <ArrowLeft size={20} />

          Back to Case Search

        </button>

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
            {error || "Case not found."}
          </p>

        </div>

      </main>
    );
  }

  // ========================================
  // Edit Mode
  // ========================================

  if (editing) {
    return (
      <main className="space-y-8">

        {/* Back Button */}

        <button
          type="button"
          onClick={handleCancelEditing}
          className="
            inline-flex
            items-center
            gap-2
            text-slate-400
            hover:text-white
            transition
          "
        >

          <ArrowLeft size={20} />

          Back to Case Details

        </button>

        {/* Edit Header */}

        <div>
          <h1 className="text-3xl font-bold text-white">
            Edit Case
          </h1>

          <p className="text-slate-400 mt-2">
            Update the information for this legal case.
          </p>
        </div>

        {/* Edit Form */}

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

          {/* Save Error */}

          {saveError && (
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
                {saveError}
              </p>

            </div>
          )}

          {/* Save Success */}

          {saveSuccess && (
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
                {saveSuccess}
              </p>

            </div>
          )}

          <form
            onSubmit={handleSaveCase}
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
                rows={6}
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
                  resize-none
                "
              />

            </div>

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="submit"
                disabled={saving}
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

                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />

                    Save Changes
                  </>
                )}

              </button>

              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={saving}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
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

                <X size={18} />

                Cancel

              </button>

            </div>

          </form>

        </section>

      </main>
    );
  }

  // ========================================
  // Case Details
  // ========================================

  return (
    <main className="space-y-8">

      {/* ========================================
          Back Button
      ======================================== */}

      <button
        type="button"
        onClick={() => navigate("/cases")}
        className="
          inline-flex
          items-center
          gap-2
          text-slate-400
          hover:text-white
          transition
        "
      >

        <ArrowLeft size={20} />

        Back to Case Search

      </button>

      {/* ========================================
          Header
      ======================================== */}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

        <div>

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
              {legalCase.case_number}
            </span>

            {legalCase.status && (
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
                {legalCase.status}
              </span>
            )}

          </div>

          <h1
            className="
              text-3xl
              font-bold
              text-white
              mt-4
            "
          >
            {legalCase.title}
          </h1>

        </div>

        {/* Edit Button */}

        <button
          type="button"
          onClick={handleStartEditing}
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

          <Edit size={18} />

          Edit Case

        </button>

      </div>

      {/* ========================================
          Case Information
      ======================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
      >

        {/* Court */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
          "
        >

          <p className="text-sm text-slate-500 mb-2">
            Court
          </p>

          <p className="text-lg text-white font-semibold">
            {legalCase.court || "Not specified"}
          </p>

        </div>

        {/* Case Type */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
          "
        >

          <p className="text-sm text-slate-500 mb-2">
            Case Type
          </p>

          <p className="text-lg text-white font-semibold">
            {legalCase.case_type || "Not specified"}
          </p>

        </div>

      </div>

      {/* ========================================
          Description
      ======================================== */}

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-8
        "
      >

        <h2 className="text-xl font-bold text-white mb-4">
          Case Description
        </h2>

        <p className="text-slate-300 leading-relaxed">
          {legalCase.description ||
            "No description available."}
        </p>

      </div>

      {/* ========================================
          Case Metadata
      ======================================== */}

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-8
        "
      >

        <h2 className="text-xl font-bold text-white mb-6">
          Case Information
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between gap-6">

            <span className="text-slate-500">
              Case ID
            </span>

            <span className="text-slate-300">
              {legalCase.id}
            </span>

          </div>

          <div className="flex justify-between gap-6">

            <span className="text-slate-500">
              Case Number
            </span>

            <span className="text-slate-300">
              {legalCase.case_number}
            </span>

          </div>

          <div className="flex justify-between gap-6">

            <span className="text-slate-500">
              Status
            </span>

            <span className="text-slate-300">
              {legalCase.status || "Not specified"}
            </span>

          </div>

          <div className="flex justify-between gap-6">

            <span className="text-slate-500">
              Created
            </span>

            <span className="text-slate-300">
              {new Date(
                legalCase.created_at
              ).toLocaleString()}
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}

export default CaseDetailsPage;