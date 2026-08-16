import { useState } from "react";

function ProfilePage() {
  const [fullName, setFullName] = useState("LexAI User");
  const [email, setEmail] = useState("user@lexai.com");
  const [role, setRole] = useState("Legal Researcher");
  const [organization, setOrganization] = useState("LexAI");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save profile information locally for now.
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
              onChange={(e) => setFullName(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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


          {/* Role */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Role
            </label>

            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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


          {/* Organization */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Organization
            </label>

            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
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