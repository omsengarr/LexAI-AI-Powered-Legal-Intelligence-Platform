import { useState } from "react";

function ProfilePage() {
  // ========================================
  // Logged-in User Information
  // ========================================

  const storedEmail =
    localStorage.getItem("lexai_user_email") || "";

  const storedRole =
    localStorage.getItem("lexai_user_role") || "client";

  const storedProfile =
    localStorage.getItem("lexai_profile");

  let savedProfile: {
    fullName?: string;
    email?: string;
    role?: string;
    organization?: string;
  } = {};

  if (storedProfile) {
    try {
      savedProfile = JSON.parse(storedProfile);
    } catch {
      savedProfile = {};
    }
  }

  // ========================================
  // Role Display Name
  // ========================================

  function getRoleName(userRole: string) {
    switch (userRole) {
      case "admin":
        return "Administrator";

      case "lawyer":
        return "Lawyer";

      case "legal_researcher":
        return "Legal Researcher";

      case "client":
        return "Client";

      default:
        return userRole;
    }
  }

  // ========================================
  // Profile State
  // ========================================

  const [fullName, setFullName] = useState(
    savedProfile.fullName || "LexAI User"
  );

  const [email] = useState(
    storedEmail || savedProfile.email || ""
  );

  const [role] = useState(
    getRoleName(storedRole)
  );

  const [organization, setOrganization] = useState(
    savedProfile.organization || "LexAI"
  );

  const [saved, setSaved] = useState(false);

  // ========================================
  // Save Profile
  // ========================================

  const handleSave = () => {
    localStorage.setItem(
      "lexai_profile",
      JSON.stringify({
        fullName,
        email,
        role,
        organization,
      })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // ========================================
  // Render
  // ========================================

  return (
    <main className="p-8 space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Profile
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your LexAI profile information.
        </p>
      </div>


      {/* Profile Card */}
      <div className="max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-8">

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-cyan-500/20
              border
              border-cyan-500/40
              flex
              items-center
              justify-center
            "
          >
            <span className="text-3xl font-bold text-cyan-400">
              {fullName.charAt(0).toUpperCase()}
            </span>
          </div>


          <div>
            <h2 className="text-2xl font-bold text-white">
              {fullName}
            </h2>

            <p className="text-slate-400">
              {role}
            </p>
          </div>

        </div>


        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
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


          {/* Email */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              readOnly
              className="
                w-full
                bg-slate-950
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
                text-slate-400
                cursor-not-allowed
                focus:outline-none
              "
            />

            <p className="text-xs text-slate-500 mt-2">
              Email is linked to your LexAI account.
            </p>
          </div>


          {/* Role */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Role
            </label>

            <input
              type="text"
              value={role}
              readOnly
              className="
                w-full
                bg-slate-950
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
                text-slate-400
                cursor-not-allowed
                focus:outline-none
              "
            />

            <p className="text-xs text-slate-500 mt-2">
              Your role is assigned by LexAI.
            </p>
          </div>


          {/* Organization */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Organization
            </label>

            <input
              type="text"
              value={organization}
              onChange={(e) =>
                setOrganization(e.target.value)
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


        {/* Account Information */}
        <div
          className="
            mt-8
            rounded-xl
            border
            border-slate-800
            bg-slate-950
            p-5
          "
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-slate-500">
                Account Email
              </p>

              <p className="text-sm text-slate-300 mt-1">
                {email}
              </p>
            </div>


            <div>
              <p className="text-xs text-slate-500">
                Account Role
              </p>

              <p className="text-sm text-cyan-400 mt-1">
                {role}
              </p>
            </div>

          </div>
        </div>


        {/* Save Section */}
        <div className="mt-8 flex items-center gap-4">

          <button
            type="button"
            onClick={handleSave}
            className="
              px-6
              py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-400
              text-white
              font-semibold
              transition
            "
          >
            Save Changes
          </button>


          {saved && (
            <p className="text-green-400 font-medium">
              Profile saved successfully.
            </p>
          )}

        </div>

      </div>

    </main>
  );
}

export default ProfilePage;