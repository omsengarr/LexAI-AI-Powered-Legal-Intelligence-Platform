import { useEffect, useState } from "react";

import {
  Settings,
  Bell,
  Shield,
  Moon,
  Sun,
  Save,
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
        rounded-full
        transition-all
        duration-200
        ${
          enabled
            ? "bg-cyan-500"
            : "bg-slate-700"
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
          shadow-sm
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
    useState(
      initialSettings.notifications
    );

  const [emailAlerts, setEmailAlerts] =
    useState(
      initialSettings.emailAlerts
    );

  const [darkMode, setDarkMode] =
    useState(
      initialSettings.darkMode
    );

  const [saved, setSaved] =
    useState(false);


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
      localStorage.getItem(
        "lexai_settings"
      );

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
  // Page
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
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-500/30
              bg-cyan-500/10
            "
          >
            <Settings
              size={25}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-white
              "
            >
              Settings
            </h1>

            <p
              className="
                mt-1
                text-slate-400
              "
            >
              Manage your LexAI application
              preferences.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================
          NOTIFICATIONS
      ======================================== */}

      <section
        className="
          max-w-3xl
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
          "
        >
          <Bell
            size={22}
            className="text-cyan-400"
          />

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Notifications
          </h2>
        </div>


        <div className="space-y-6">

          {/* Application Notifications */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-6
            "
          >

            <div>
              <h3
                className="
                  font-medium
                  text-white
                "
              >
                Application Notifications
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Receive notifications about
                activity in LexAI.
              </p>
            </div>

            <Toggle
              enabled={notifications}
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
              label="Toggle application notifications"
            />

          </div>


          {/* Email Alerts */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-6
            "
          >

            <div>
              <h3
                className="
                  font-medium
                  text-white
                "
              >
                Email Alerts
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Receive important alerts
                through email.
              </p>
            </div>

            <Toggle
              enabled={emailAlerts}
              onClick={() =>
                setEmailAlerts(
                  !emailAlerts
                )
              }
              label="Toggle email alerts"
            />

          </div>

        </div>

      </section>


      {/* ========================================
          APPEARANCE
      ======================================== */}

      <section
        className="
          max-w-3xl
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
          "
        >

          {darkMode ? (
            <Moon
              size={22}
              className="text-cyan-400"
            />
          ) : (
            <Sun
              size={22}
              className="text-cyan-400"
            />
          )}

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Appearance
          </h2>

        </div>


        <div
          className="
            flex
            items-center
            justify-between
            gap-6
          "
        >

          <div>

            <h3
              className="
                font-medium
                text-white
              "
            >
              {darkMode
                ? "Dark Mode"
                : "Light Mode"}
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {darkMode
                ? "Use the dark interface for LexAI."
                : "Use the light interface for LexAI."}
            </p>

          </div>


          <Toggle
            enabled={darkMode}
            onClick={() =>
              setDarkMode(!darkMode)
            }
            label="Toggle dark mode"
          />

        </div>

      </section>


      {/* ========================================
          SECURITY
      ======================================== */}

      <section
        className="
          max-w-3xl
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
          "
        >

          <Shield
            size={22}
            className="text-cyan-400"
          />

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Security
          </h2>

        </div>


        <div>

          <h3
            className="
              font-medium
              text-white
            "
          >
            Account Security
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Your LexAI account is protected
            by secure authentication.
          </p>

        </div>

      </section>


      {/* ========================================
          SAVE SETTINGS
      ======================================== */}

      <div
        className="
          flex
          max-w-3xl
          items-center
          gap-4
        "
      >

        <button
          type="button"
          onClick={handleSave}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-cyan-400
          "
        >

          <Save size={18} />

          Save Settings

        </button>


        {saved && (
          <span
            className="
              text-sm
              text-green-400
            "
          >
            Settings saved successfully.
          </span>
        )}

      </div>

    </main>
  );
}

export default SettingsPage;