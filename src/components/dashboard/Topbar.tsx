import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  ChevronDown,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  UserCircle,
  Search,
  FileText,
  Scale,
  X,
} from "lucide-react";

// ==========================================
// SEARCH DATA
// ==========================================

const searchItems = [
  {
    title: "Employment Agreement",
    type: "Document",
    category: "Contract",
  },
  {
    title: "Property Dispute Case",
    type: "Case",
    category: "Civil Law",
  },
  {
    title: "Non-Disclosure Agreement",
    type: "Document",
    category: "Contract",
  },
  {
    title: "Intellectual Property Rights",
    type: "Case",
    category: "IP Law",
  },
  {
    title: "Privacy Policy Compliance",
    type: "Document",
    category: "Compliance",
  },
  {
    title: "Consumer Protection Act",
    type: "Case",
    category: "Consumer Law",
  },
  {
    title: "Contract Risk Assessment",
    type: "Document",
    category: "Risk Analysis",
  },
  {
    title: "High Risk Legal Clause",
    type: "Document",
    category: "Risk Analysis",
  },
  {
    title: "Corporate Compliance Risk Report",
    type: "Report",
    category: "Risk Analysis",
  },
  {
    title: "Legal Risk Analysis Case",
    type: "Case",
    category: "Risk Management",
  },
];

// ==========================================
// TOPBAR
// ==========================================

function Topbar() {
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  // ==========================================
  // GET USER EMAIL
  // ==========================================

  const userEmail =
    localStorage.getItem("lexai_user_email") ||
    "Legal AI User";

  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {
    localStorage.removeItem("lexai_authenticated");
    localStorage.removeItem("lexai_user_email");

    setProfileOpen(false);

    navigate("/login", {
      replace: true,
    });
  }

  // ==========================================
  // SEARCH FILTER
  // ==========================================

  const filteredResults =
    searchQuery.trim() === ""
      ? []
      : searchItems.filter((item) =>
          `${item.title} ${item.type} ${item.category}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

  return (
    <div
      className="
        h-20
        bg-slate-950
        border-b
        border-slate-800
        flex
        items-center
        justify-between
        px-6
        gap-6
      "
    >

      {/* ====================================== */}
      {/* SEARCH SECTION */}
      {/* ====================================== */}

      <div
        className="
          relative
          flex-1
          max-w-xl
        "
      >
        <div className="relative">

          <Search
            size={19}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search legal documents, cases..."
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              pl-11
              pr-10
              py-2.5
              text-white
              placeholder-slate-500
              w-full
              outline-none
              focus:border-cyan-500
              transition
            "
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-500
                hover:text-white
                transition
              "
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}

        </div>

        {/* ====================================== */}
        {/* SEARCH RESULTS */}
        {/* ====================================== */}

        {searchQuery && (
          <div
            className="
              absolute
              left-0
              right-0
              top-14
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              shadow-2xl
              p-2
              z-50
            "
          >

            {filteredResults.length > 0 ? (
              <>
                <div
                  className="
                    px-3
                    py-2
                    text-xs
                    text-slate-500
                    uppercase
                    tracking-wider
                  "
                >
                  Search Results
                </div>

                <div className="space-y-1">

                  {filteredResults.map(
                    (item, index) => (
                      <button
                        type="button"
                        key={index}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-3
                          rounded-lg
                          hover:bg-slate-800
                          transition
                          text-left
                        "
                      >

                        <div
                          className="
                            w-9
                            h-9
                            rounded-lg
                            bg-cyan-500/10
                            text-cyan-400
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          {item.type === "Document" ||
                          item.type === "Report" ? (
                            <FileText size={18} />
                          ) : (
                            <Scale size={18} />
                          )}
                        </div>

                        <div className="flex-1">

                          <p
                            className="
                              text-white
                              text-sm
                              font-medium
                            "
                          >
                            {item.title}
                          </p>

                          <p
                            className="
                              text-slate-500
                              text-xs
                              mt-1
                            "
                          >
                            {item.type} • {item.category}
                          </p>

                        </div>

                      </button>
                    )
                  )}

                </div>
              </>
            ) : (
              <div
                className="
                  px-4
                  py-6
                  text-center
                "
              >

                <Search
                  size={24}
                  className="
                    mx-auto
                    text-slate-600
                    mb-2
                  "
                />

                <p
                  className="
                    text-slate-400
                    text-sm
                  "
                >
                  No results found
                </p>

                <p
                  className="
                    text-slate-600
                    text-xs
                    mt-1
                  "
                >
                  Try another search term
                </p>

              </div>
            )}

          </div>
        )}

      </div>

      {/* ====================================== */}
      {/* RIGHT SECTION */}
      {/* ====================================== */}

      <div
        className="
          flex
          items-center
          gap-5
        "
      >

        {/* ====================================== */}
        {/* NOTIFICATIONS */}
        {/* ====================================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setNotificationOpen(
                !notificationOpen
              )
            }
            className="
              relative
              text-slate-300
              hover:text-white
              transition
            "
            aria-label="Notifications"
          >

            <Bell size={24} />

            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                text-xs
                rounded-full
                h-5
                w-5
                flex
                items-center
                justify-center
              "
            >
              3
            </span>

          </button>

          {/* Notification Dropdown */}

          {notificationOpen && (
            <div
              className="
                absolute
                right-0
                top-12
                w-80
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                shadow-2xl
                p-4
                z-50
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-4
                "
              >

                <h3
                  className="
                    text-white
                    font-semibold
                  "
                >
                  Notifications
                </h3>

                <span
                  className="
                    text-xs
                    text-cyan-400
                  "
                >
                  3 new
                </span>

              </div>

              <div
                className="
                  bg-slate-800
                  rounded-lg
                  p-3
                  hover:bg-slate-700
                  transition
                  cursor-pointer
                "
              >
                <p
                  className="
                    text-white
                    text-sm
                    font-medium
                  "
                >
                  Document analysis completed
                </p>

                <p
                  className="
                    text-slate-400
                    text-xs
                    mt-1
                  "
                >
                  Your uploaded document has
                  been analyzed.
                </p>
              </div>

              <div
                className="
                  bg-slate-800
                  rounded-lg
                  p-3
                  hover:bg-slate-700
                  transition
                  cursor-pointer
                  mt-3
                "
              >
                <p
                  className="
                    text-white
                    text-sm
                    font-medium
                  "
                >
                  Risk alert detected
                </p>

                <p
                  className="
                    text-slate-400
                    text-xs
                    mt-1
                  "
                >
                  Risk detected in Case #1024.
                </p>
              </div>

              <div
                className="
                  bg-slate-800
                  rounded-lg
                  p-3
                  hover:bg-slate-700
                  transition
                  cursor-pointer
                  mt-3
                "
              >
                <p
                  className="
                    text-white
                    text-sm
                    font-medium
                  "
                >
                  AI report generated
                </p>

                <p
                  className="
                    text-slate-400
                    text-xs
                    mt-1
                  "
                >
                  Your legal intelligence report
                  is ready.
                </p>
              </div>

              <button
                type="button"
                className="
                  w-full
                  mt-4
                  text-sm
                  text-cyan-400
                  hover:text-cyan-300
                  transition
                "
              >
                View all notifications
              </button>

            </div>
          )}

        </div>

        {/* ====================================== */}
        {/* PROFILE */}
        {/* ====================================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            className="
              flex
              items-center
              gap-3
              cursor-pointer
              hover:bg-slate-900
              rounded-xl
              px-3
              py-2
              transition
            "
          >

            <div
              className="
                bg-cyan-500/20
                p-2
                rounded-full
                text-cyan-400
              "
            >
              <User size={22} />
            </div>

            <div className="text-left">

              <p
                className="
                  text-white
                  text-sm
                  font-medium
                "
              >
                Om Sengar
              </p>

              <p
                className="
                  text-slate-400
                  text-xs
                  truncate
                  max-w-[180px]
                "
              >
                {userEmail}
              </p>

            </div>

            <ChevronDown
              size={18}
              className="text-slate-400"
            />

          </button>

          {/* ================================= */}
          {/* PROFILE DROPDOWN */}
          {/* ================================= */}

          {profileOpen && (
            <div
              className="
                absolute
                right-0
                top-14
                w-64
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                shadow-2xl
                p-2
                z-50
              "
            >

              {/* Profile Header */}

              <div
                className="
                  px-3
                  py-3
                  border-b
                  border-slate-800
                  mb-2
                "
              >

                <p
                  className="
                    text-white
                    font-semibold
                  "
                >
                  Om Sengar
                </p>

                <p
                  className="
                    text-slate-400
                    text-xs
                    mt-1
                    truncate
                  "
                >
                  {userEmail}
                </p>

              </div>

              {/* My Profile */}

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  text-slate-300
                  hover:text-white
                  hover:bg-slate-800
                  rounded-lg
                  transition
                  text-left
                "
              >

                <UserCircle size={19} />

                <span>
                  My Profile
                </span>

              </button>

              {/* Settings */}

              <button
                type="button"
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  text-slate-300
                  hover:text-white
                  hover:bg-slate-800
                  rounded-lg
                  transition
                  text-left
                "
              >

                <Settings size={19} />

                <span>
                  Settings
                </span>

              </button>

              {/* Security */}

              <button
                type="button"
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  text-slate-300
                  hover:text-white
                  hover:bg-slate-800
                  rounded-lg
                  transition
                  text-left
                "
              >

                <ShieldCheck size={19} />

                <span>
                  Security
                </span>

              </button>

              {/* Divider */}

              <div
                className="
                  border-t
                  border-slate-800
                  my-2
                "
              />

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-3
                  text-red-400
                  hover:text-red-300
                  hover:bg-slate-800
                  rounded-lg
                  transition
                  text-left
                "
              >

                <LogOut size={19} />

                <span>
                  Logout
                </span>

              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Topbar;