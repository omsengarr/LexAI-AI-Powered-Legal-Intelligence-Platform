import { useEffect, useState } from "react";

import {
  Bell,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Moon,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";

interface LexAISettings {
  notifications: boolean;
  emailAlerts: boolean;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: LexAISettings = {
  notifications: true,
  emailAlerts: true,
  darkMode: true,
};

function loadSettings(): LexAISettings {
  try {
    const savedSettings = localStorage.getItem(
      "lexai_settings"
    );

    if (!savedSettings) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(savedSettings);

    return {
      notifications:
        typeof parsed.notifications === "boolean"
          ? parsed.notifications
          : DEFAULT_SETTINGS.notifications,

      emailAlerts:
        typeof parsed.emailAlerts === "boolean"
          ? parsed.emailAlerts
          : DEFAULT_SETTINGS.emailAlerts,

      darkMode:
        typeof parsed.darkMode === "boolean"
          ? parsed.darkMode
          : DEFAULT_SETTINGS.darkMode,
    };
  } catch (error) {
    console.error(
      "Failed to load LexAI settings:",
      error
    );

    return DEFAULT_SETTINGS;
  }
}

function applyTheme(darkMode: boolean) {
  const root = document.documentElement;

  if (darkMode) {
    root.classList.remove("light");
    root.style.colorScheme = "dark";
  } else {
    root.classList.add("light");
    root.style.colorScheme = "light";
  }
}

function Toggle({
  enabled,
  onClick,
  label,
}: {
  enabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={enabled}
      className={`
        relative
        h-7
        w-14
        shrink-0
        rounded-full
        border
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-500/20
        ${
          enabled
            ? "border-cyan-400/20 bg-cyan-500"
            : "border-slate-700 bg-slate-800"
        }
      `}
    >
      <span
        className={`
          absolute
          top-1
          h-5
          w-5
          rounded-full
          bg-white
          shadow-md
          transition-all
          duration-200
          ${
            enabled
              ? "left-8"
              : "left-1"
          }
        `}
      />
    </button>
  );
}

function SettingsPage() {
  // ========================================
  // Load settings BEFORE first render
  // ========================================

  const [initialSettings] =
    useState<LexAISettings>(() =>
      loadSettings()
    );

  const [notifications, setNotifications] =
    useState(initialSettings.notifications);

  const [emailAlerts, setEmailAlerts] =
    useState(initialSettings.emailAlerts);

  const [darkMode, setDarkMode] =
    useState(initialSettings.darkMode);

  const [saved, setSaved] = useState(false);

  // ========================================
  // Apply theme
  // ========================================

  useEffect(() => {
    applyTheme(darkMode);
  }, [darkMode]);

  // ========================================
  // Save theme immediately
  // ========================================

  useEffect(() => {
    const currentSettings =
      localStorage.getItem("lexai_settings");

    let existingSettings: Record<
      string,
      unknown
    > = {};

    if (currentSettings) {
      try {
        existingSettings =
          JSON.parse(currentSettings);
      } catch {
        existingSettings = {};
      }
    }

    localStorage.setItem(
      "lexai_settings",
      JSON.stringify({
        ...existingSettings,
        darkMode,
      })
    );
  }, [darkMode]);

  // ========================================
  // Save all settings
  // ========================================

  const handleSave = () => {
    const settings: LexAISettings = {
      notifications,
      emailAlerts,
      darkMode,
    };

    localStorage.setItem(
      "lexai_settings",
      JSON.stringify(settings)
    );

    applyTheme(darkMode);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

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
            HEADER
        ======================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-purple-500/[0.05]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                <Settings className="h-3.5 w-3.5" />
                Workspace Configuration
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your LexAI application preferences,
                notifications, appearance, and account
                configuration.
              </p>
            </div>

            {/* Settings status */}

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Configuration
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
            SETTINGS GRID
        ======================================== */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* ========================================
              NOTIFICATIONS
          ======================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-transparent" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                    <Bell className="h-5 w-5 text-cyan-300" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Notifications
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Control how LexAI keeps you informed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {/* Application Notifications */}

                <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-slate-700">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800/70">
                      <Bell className="h-4 w-4 text-slate-400" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        Application Notifications
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Receive notifications about activity
                        in LexAI.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={notifications}
                    onClick={() =>
                      setNotifications(!notifications)
                    }
                    label="Toggle application notifications"
                  />
                </div>

                {/* Email Alerts */}

                <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-slate-700">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800/70">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        Email Alerts
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Receive important alerts through
                        email.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={emailAlerts}
                    onClick={() =>
                      setEmailAlerts(!emailAlerts)
                    }
                    label="Toggle email alerts"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              APPEARANCE
          ======================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.04] via-transparent to-transparent" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                    {darkMode ? (
                      <Moon className="h-5 w-5 text-purple-300" />
                    ) : (
                      <Sun className="h-5 w-5 text-amber-300" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Appearance
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose how LexAI looks on your device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800/70">
                      {darkMode ? (
                        <Moon className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Sun className="h-4 w-4 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        {darkMode
                          ? "Dark Mode"
                          : "Light Mode"}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {darkMode
                          ? "Use the dark interface for LexAI."
                          : "Use the light interface for LexAI."}
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={darkMode}
                    onClick={() =>
                      setDarkMode(!darkMode)
                    }
                    label="Toggle dark mode"
                  />
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-300" />

                  <p className="text-xs text-slate-600">
                    Appearance preference is applied
                    immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              SECURITY
          ======================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-transparent" />

            <div className="relative">
              <div className="flex items-start gap-4 border-b border-slate-800 pb-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Review the current account security status.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                    <LockKeyhole className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        Account Security
                      </h3>

                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                        Protected
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      Your LexAI account is protected by
                      secure authentication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              PREFERENCES SUMMARY
          ======================================== */}

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-cyan-500/[0.03]" />

            <div className="relative">
              <div className="flex items-start gap-4 border-b border-slate-800 pb-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <Settings className="h-5 w-5 text-blue-300" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Current Preferences
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Quick overview of your active configuration.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    Notifications
                  </p>

                  <p
                    className={`mt-2 text-sm font-semibold ${
                      notifications
                        ? "text-emerald-300"
                        : "text-slate-500"
                    }`}
                  >
                    {notifications
                      ? "Enabled"
                      : "Disabled"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    Email Alerts
                  </p>

                  <p
                    className={`mt-2 text-sm font-semibold ${
                      emailAlerts
                        ? "text-emerald-300"
                        : "text-slate-500"
                    }`}
                  >
                    {emailAlerts
                      ? "Enabled"
                      : "Disabled"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    Theme
                  </p>

                  <p className="mt-2 text-sm font-semibold text-cyan-300">
                    {darkMode ? "Dark" : "Light"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            SAVE SETTINGS
        ======================================== */}

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <Save className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-300">
                Save your workspace preferences
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Your settings are stored locally for this
                LexAI session.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            {saved && (
              <span className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Settings saved successfully
              </span>
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
              Save Settings
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SettingsPage;