import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

/*
 * =========================================================
 * LOAD LEXAI THEME BEFORE REACT RENDERS
 * =========================================================
 *
 * Dark mode is the default.
 *
 * The saved theme is loaded before React renders so the
 * application does not flash into the wrong theme on refresh.
 */

const savedSettings = localStorage.getItem("lexai_settings");

if (savedSettings) {
  try {
    const settings = JSON.parse(savedSettings);

    if (typeof settings.darkMode === "boolean") {
      if (settings.darkMode) {
        document.documentElement.classList.remove("light");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.style.colorScheme = "light";
      }
    }
  } catch (error) {
    console.error("Failed to load LexAI theme:", error);

    document.documentElement.classList.remove("light");
    document.documentElement.style.colorScheme = "dark";
  }
} else {
  /*
   * Dark mode is the default when no saved setting exists.
   */
  document.documentElement.classList.remove("light");
  document.documentElement.style.colorScheme = "dark";
}


/*
 * =========================================================
 * RENDER APPLICATION
 * =========================================================
 */

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);