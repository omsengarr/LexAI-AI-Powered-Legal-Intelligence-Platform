import { useEffect, useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Moon,
  Save,
} from "lucide-react";

function SettingsPage() {

  // ========================================
  // Settings State
  // ========================================

  const [notifications, setNotifications] = useState(true);

  const [emailAlerts, setEmailAlerts] = useState(true);

  const [darkMode, setDarkMode] = useState(true);

  const [saved, setSaved] = useState(false);


  // ========================================
  // Load Saved Settings
  // ========================================

  useEffect(() => {

    const savedSettings =
      localStorage.getItem("lexai_settings");

    if (!savedSettings) {
      return;
    }

    try {

      const settings = JSON.parse(savedSettings);

      if (typeof settings.notifications === "boolean") {
        setNotifications(settings.notifications);
      }

      if (typeof settings.emailAlerts === "boolean") {
        setEmailAlerts(settings.emailAlerts);
      }

      if (typeof settings.darkMode === "boolean") {
        setDarkMode(settings.darkMode);
      }

    } catch (error) {

      console.error(
        "Failed to load saved settings:",
        error
      );

    }

  }, []);


  // ========================================
  // Save Settings
  // ========================================

  const handleSave = () => {

    const settings = {
      notifications,
      emailAlerts,
      darkMode,
    };

    localStorage.setItem(
      "lexai_settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);

  };


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
              bg-cyan-500/10
              border
              border-cyan-500/30
              flex
              items-center
              justify-center
            "
          >

            <Settings
              size={25}
              className="text-cyan-400"
            />

          </div>


          <div>

            <h1 className="text-3xl font-bold text-white">
              Settings
            </h1>

            <p className="text-slate-400 mt-1">
              Manage your LexAI application preferences.
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
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
        "
      >

        <div className="flex items-center gap-3 mb-6">

          <Bell
            size={22}
            className="text-cyan-400"
          />

          <h2 className="text-xl font-semibold text-white">
            Notifications
          </h2>

        </div>


        <div className="space-y-6">

          {/* Application Notifications */}

          <div className="flex items-center justify-between gap-6">

            <div>

              <h3 className="text-white font-medium">
                Application Notifications
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Receive notifications about activity in LexAI.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setNotifications(!notifications)
              }
              aria-label="Toggle application notifications"
              className={`
                relative
                w-12
                h-6
                rounded-full
                transition
                ${
                  notifications
                    ? "bg-cyan-500"
                    : "bg-slate-700"
                }
              `}
            >

              <span
                className={`
                  absolute
                  top-1
                  w-4
                  h-4
                  rounded-full
                  bg-white
                  transition
                  ${
                    notifications
                      ? "left-7"
                      : "left-1"
                  }
                `}
              />

            </button>

          </div>


          {/* Email Alerts */}

          <div className="flex items-center justify-between gap-6">

            <div>

              <h3 className="text-white font-medium">
                Email Alerts
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Receive important alerts through email.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setEmailAlerts(!emailAlerts)
              }
              aria-label="Toggle email alerts"
              className={`
                relative
                w-12
                h-6
                rounded-full
                transition
                ${
                  emailAlerts
                    ? "bg-cyan-500"
                    : "bg-slate-700"
                }
              `}
            >

              <span
                className={`
                  absolute
                  top-1
                  w-4
                  h-4
                  rounded-full
                  bg-white
                  transition
                  ${
                    emailAlerts
                      ? "left-7"
                      : "left-1"
                  }
                `}
              />

            </button>

          </div>

        </div>

      </section>


      {/* ========================================
          APPEARANCE
      ======================================== */}

      <section
        className="
          max-w-3xl
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
        "
      >

        <div className="flex items-center gap-3 mb-6">

          <Moon
            size={22}
            className="text-cyan-400"
          />

          <h2 className="text-xl font-semibold text-white">
            Appearance
          </h2>

        </div>


        <div className="flex items-center justify-between gap-6">

          <div>

            <h3 className="text-white font-medium">
              Dark Mode
            </h3>

            <p className="text-slate-500 text-sm mt-1">
              Use the dark interface for LexAI.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              setDarkMode(!darkMode)
            }
            aria-label="Toggle dark mode"
            className={`
              relative
              w-12
              h-6
              rounded-full
              transition
              ${
                darkMode
                  ? "bg-cyan-500"
                  : "bg-slate-700"
              }
            `}
          >

            <span
              className={`
                absolute
                top-1
                w-4
                h-4
                rounded-full
                bg-white
                transition
                ${
                  darkMode
                    ? "left-7"
                    : "left-1"
                }
              `}
            />

          </button>

        </div>

      </section>


      {/* ========================================
          SECURITY
      ======================================== */}

      <section
        className="
          max-w-3xl
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
        "
      >

        <div className="flex items-center gap-3 mb-6">

          <Shield
            size={22}
            className="text-cyan-400"
          />

          <h2 className="text-xl font-semibold text-white">
            Security
          </h2>

        </div>


        <div>

          <h3 className="text-white font-medium">
            Account Security
          </h3>

          <p className="text-slate-500 text-sm mt-1">
            Your LexAI account is protected by secure authentication.
          </p>

        </div>

      </section>


      {/* ========================================
          SAVE SETTINGS
      ======================================== */}

      <div className="max-w-3xl flex items-center gap-4">

        <button
          type="button"
          onClick={handleSave}
          className="
            flex
            items-center
            gap-2
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

          <Save size={18} />

          Save Settings

        </button>


        {saved && (

          <span className="text-green-400 text-sm">
            Settings saved successfully.
          </span>

        )}

      </div>

    </main>
  );
}

export default SettingsPage;