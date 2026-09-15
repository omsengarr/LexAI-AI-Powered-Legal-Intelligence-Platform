import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  UserRound,
} from "lucide-react";

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
  // Avatar Initial
  // ========================================

  const avatarInitial =
    fullName.trim().charAt(0).toUpperCase() || "L";

  // ========================================
  // Render
  // ========================================

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ========================================
          AMBIENT BACKGROUND
      ======================================== */}

      <div className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10 space-y-8">
        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.05]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                <UserRound className="h-3.5 w-3.5" />
                Account Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Profile
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your LexAI profile information,
                organization details, and account identity.
              </p>
            </div>

            {/* Account status */}

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Account Status
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            PROFILE WORKSPACE
        ======================================== */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.7fr]">
          {/* ========================================
              PROFILE IDENTITY
          ======================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-transparent" />

            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <User className="h-4 w-4 text-cyan-300" />
                Identity
              </div>

              {/* Avatar */}

              <div className="mt-7 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 shadow-2xl shadow-cyan-500/5">
                    <span className="text-4xl font-bold text-cyan-300">
                      {avatarInitial}
                    </span>
                  </div>

                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>

                <h2 className="mt-6 max-w-full truncate text-2xl font-bold text-white">
                  {fullName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {role}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-3 py-1.5 text-xs font-medium text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  LexAI Member
                </div>
              </div>

              {/* Identity details */}

              <div className="mt-8 space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500" />

                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        Account Email
                      </p>

                      <p className="mt-1 truncate text-sm text-slate-300">
                        {email || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-slate-500" />

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        Account Role
                      </p>

                      <p className="mt-1 text-sm text-cyan-300">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy note */}

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                <p className="text-xs leading-5 text-slate-500">
                  Your account identity information is linked
                  to your LexAI session.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================
              PROFILE DETAILS
          ======================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] via-transparent to-cyan-500/[0.02]" />

            <div className="relative">
              {/* Section heading */}

              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Profile Details
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the information associated with your
                    LexAI workspace.
                  </p>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 sm:flex">
                  <UserRound className="h-5 w-5 text-cyan-300" />
                </div>
              </div>

              {/* Fields */}

              <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}

                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-slate-700
                        bg-slate-950/80
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        transition
                        hover:border-slate-600
                        focus:border-cyan-500/60
                        focus:ring-2
                        focus:ring-cyan-500/10
                      "
                    />
                  </div>
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                      className="
                        w-full
                        cursor-not-allowed
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-950/50
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-slate-500
                        outline-none
                      "
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Email is linked to your LexAI account.
                  </p>
                </div>

                {/* Role */}

                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Role
                  </label>

                  <div className="relative">
                    <ShieldCheck
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700"
                    />

                    <input
                      id="role"
                      type="text"
                      value={role}
                      readOnly
                      className="
                        w-full
                        cursor-not-allowed
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-950/50
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-slate-500
                        outline-none
                      "
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Your role is assigned by LexAI.
                  </p>
                </div>

                {/* Organization */}

                <div>
                  <label
                    htmlFor="organization"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Organization
                  </label>

                  <div className="relative">
                    <Building2
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="organization"
                      type="text"
                      value={organization}
                      onChange={(e) =>
                        setOrganization(e.target.value)
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-slate-700
                        bg-slate-950/80
                        py-3.5
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        transition
                        hover:border-slate-600
                        focus:border-cyan-500/60
                        focus:ring-2
                        focus:ring-cyan-500/10
                      "
                    />
                  </div>
                </div>
              </div>

              {/* Account Information */}

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/70">
                    <LockKeyhole className="h-4 w-4 text-slate-400" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Account Information
                    </h3>

                    <p className="text-xs text-slate-600">
                      Read-only account details
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Account Email
                    </p>

                    <p className="mt-2 truncate text-sm text-slate-300">
                      {email || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Account Role
                    </p>

                    <p className="mt-2 text-sm text-cyan-300">
                      {role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Section */}

              <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Keep your profile information up to date.
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Changes are saved to your LexAI profile.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {saved && (
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Saved successfully
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSave}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border
                      border-cyan-400/20
                      bg-cyan-500
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-cyan-500/10
                      transition-all
                      hover:-translate-y-0.5
                      hover:bg-cyan-400
                      focus:outline-none
                      focus:ring-2
                      focus:ring-cyan-500/30
                    "
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            PROFILE FOOTER STATUS
        ======================================== */}

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-300">
                Profile workspace active
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Your editable profile fields are ready.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Account connected
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;