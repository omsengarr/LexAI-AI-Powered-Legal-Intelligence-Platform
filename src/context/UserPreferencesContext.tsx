import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface LexAIProfile {
  fullName: string;
  email: string;
  role: string;
  organization: string;
  photo: string;
}

export interface LexAISettings {
  notifications: boolean;
  emailAlerts: boolean;
  darkMode: boolean;
}

interface UserPreferencesContextValue {
  profile: LexAIProfile;
  settings: LexAISettings;

  updateProfile: (
    updates: Partial<LexAIProfile>
  ) => void;

  saveProfile: (
    updates: Partial<LexAIProfile>
  ) => void;

  updateSettings: (
    updates: Partial<LexAISettings>
  ) => void;

  saveSettings: (
    updates?: Partial<LexAISettings>
  ) => void;

  resetProfile: () => void;
}

const DEFAULT_SETTINGS: LexAISettings = {
  notifications: true,
  emailAlerts: true,
  darkMode: true,
};

function getRoleName(role: string) {
  switch (role) {
    case "admin":
      return "Administrator";

    case "lawyer":
      return "Lawyer";

    case "legal_researcher":
      return "Legal Researcher";

    case "client":
      return "Client";

    default:
      return role || "Client";
  }
}

function loadProfile(): LexAIProfile {
  const storedEmail =
    localStorage.getItem("lexai_user_email") || "";

  const storedRole =
    localStorage.getItem("lexai_user_role") || "client";

  const storedProfile =
    localStorage.getItem("lexai_profile");

  let parsedProfile: Partial<LexAIProfile> = {};

  if (storedProfile) {
    try {
      parsedProfile = JSON.parse(storedProfile);
    } catch {
      parsedProfile = {};
    }
  }

  return {
    fullName:
      parsedProfile.fullName ||
      "LexAI User",

    email:
      storedEmail ||
      parsedProfile.email ||
      "",

    role:
      parsedProfile.role ||
      getRoleName(storedRole),

    organization:
      parsedProfile.organization ||
      "LexAI",

    photo:
      parsedProfile.photo ||
      "",
  };
}

function loadSettings(): LexAISettings {
  const storedSettings =
    localStorage.getItem("lexai_settings");

  if (!storedSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsed = JSON.parse(
      storedSettings
    );

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
  } catch {
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

const UserPreferencesContext =
  createContext<UserPreferencesContextValue | null>(
    null
  );

export function UserPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [profile, setProfile] =
    useState<LexAIProfile>(() =>
      loadProfile()
    );

  const [settings, setSettings] =
    useState<LexAISettings>(() =>
      loadSettings()
    );

  // Apply the saved theme as soon as the application loads.
  useEffect(() => {
    applyTheme(settings.darkMode);
  }, [settings.darkMode]);

  // Keep profile synchronized if another browser tab changes it.
  useEffect(() => {
    const handleStorage = (
      event: StorageEvent
    ) => {
      if (event.key === "lexai_profile") {
        setProfile(loadProfile());
      }

      if (event.key === "lexai_settings") {
        setSettings(loadSettings());
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const updateProfile = (
    updates: Partial<LexAIProfile>
  ) => {
    setProfile((current) => ({
      ...current,
      ...updates,
    }));
  };

  const saveProfile = (
    updates: Partial<LexAIProfile>
  ) => {
    setProfile((current) => {
      const nextProfile = {
        ...current,
        ...updates,
      };

      localStorage.setItem(
        "lexai_profile",
        JSON.stringify(nextProfile)
      );

      if (nextProfile.email) {
        localStorage.setItem(
          "lexai_user_email",
          nextProfile.email
        );
      }

      window.dispatchEvent(
        new CustomEvent(
          "lexai-profile-updated"
        )
      );

      return nextProfile;
    });
  };

  const updateSettings = (
    updates: Partial<LexAISettings>
  ) => {
    setSettings((current) => ({
      ...current,
      ...updates,
    }));
  };

  const saveSettings = (
    updates: Partial<LexAISettings> = {}
  ) => {
    setSettings((current) => {
      const nextSettings = {
        ...current,
        ...updates,
      };

      localStorage.setItem(
        "lexai_settings",
        JSON.stringify(nextSettings)
      );

      applyTheme(nextSettings.darkMode);

      window.dispatchEvent(
        new CustomEvent(
          "lexai-settings-updated"
        )
      );

      return nextSettings;
    });
  };

  const resetProfile = () => {
    const storedEmail =
      localStorage.getItem(
        "lexai_user_email"
      ) || "";

    const storedRole =
      localStorage.getItem(
        "lexai_user_role"
      ) || "client";

    const defaultProfile: LexAIProfile = {
      fullName: "LexAI User",
      email: storedEmail,
      role: getRoleName(storedRole),
      organization: "LexAI",
      photo: "",
    };

    localStorage.setItem(
      "lexai_profile",
      JSON.stringify(defaultProfile)
    );

    setProfile(defaultProfile);

    window.dispatchEvent(
      new CustomEvent(
        "lexai-profile-updated"
      )
    );
  };

  const value = useMemo(
    () => ({
      profile,
      settings,
      updateProfile,
      saveProfile,
      updateSettings,
      saveSettings,
      resetProfile,
    }),
    [profile, settings]
  );

  return (
    <UserPreferencesContext.Provider
      value={value}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(
    UserPreferencesContext
  );

  if (!context) {
    throw new Error(
      "useUserPreferences must be used inside UserPreferencesProvider"
    );
  }

  return context;
}