import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Command,
  FileText,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { useUserPreferences } from "../../context/UserPreferencesContext";

interface TopbarProps {
  children?: ReactNode;
}

interface SearchItem {
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
}

const searchItems: SearchItem[] = [
  {
    title: "Dashboard",
    description: "Overview of your legal intelligence workspace",
    path: "/dashboard",
    icon: <ShieldCheck size={16} />,
  },
  {
    title: "Documents",
    description: "Upload and manage legal documents",
    path: "/documents",
    icon: <FileText size={16} />,
  },
  {
    title: "AI Chat",
    description: "Ask questions about your legal data",
    path: "/chat",
    icon: <Command size={16} />,
  },
  {
    title: "Case Search",
    description: "Search and manage your cases",
    path: "/cases",
    icon: <Search size={16} />,
  },
  {
    title: "Risk Analysis",
    description: "Analyze legal risks and exposure",
    path: "/risk-analysis",
    icon: <ShieldCheck size={16} />,
  },
  {
    title: "Compliance",
    description: "Review compliance requirements",
    path: "/compliance",
    icon: <ShieldCheck size={16} />,
  },
  {
    title: "Analytics",
    description: "View legal intelligence analytics",
    path: "/analytics",
    icon: <Command size={16} />,
  },
  {
    title: "Judgment Comparison",
    description: "Compare legal judgments",
    path: "/comparison",
    icon: <FileText size={16} />,
  },
  {
    title: "Profile",
    description: "Manage your profile",
    path: "/profile",
    icon: <User size={16} />,
  },
  {
    title: "Settings",
    description: "Manage application settings",
    path: "/settings",
    icon: <Settings size={16} />,
  },
];

function Topbar({ children }: TopbarProps) {
  const navigate = useNavigate();

  const { profile } = useUserPreferences();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const userEmail = profile.email || "admin@lexai.demo";

  const profileName =
    profile.fullName.trim() || userEmail;

  const avatarInitial =
    profileName.charAt(0).toUpperCase() || "L";

  const filteredSearchItems =
    searchQuery.trim().length === 0
      ? searchItems.slice(0, 5)
      : searchItems.filter((item) => {
          const query = searchQuery.toLowerCase();

          return (
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
          );
        });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setIsSearchFocused(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setIsNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchFocused(false);
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        const input = searchRef.current?.querySelector(
          "input"
        ) as HTMLInputElement | null;

        input?.focus();
      }
    };

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const handleSearchSelect = (path: string) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("lexai_authenticated");
    localStorage.removeItem("lexai_user_email");

    setIsProfileOpen(false);

    navigate("/login");
  };

  const toggleNotification = () => {
    setIsNotificationOpen((current) => !current);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen((current) => !current);
    setIsNotificationOpen(false);
  };

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-20
        border-b
        border-slate-800/70
        bg-slate-950/75
        backdrop-blur-xl
      "
    >
      <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left side / optional children */}
        <div className="flex min-w-0 flex-1 items-center">
          {children}
        </div>

        {/* Search */}
        <div
          ref={searchRef}
          className="
            relative
            hidden
            w-full
            max-w-md
            lg:block
          "
        >
          <div
            className={`
              flex
              h-11
              items-center
              gap-3
              rounded-xl
              border
              px-3
              transition-all
              ${
                isSearchFocused
                  ? "border-cyan-400/40 bg-slate-900/70 shadow-lg shadow-cyan-500/5"
                  : "border-slate-800/80 bg-slate-950/60"
              }
            `}
          >
            <Search
              size={17}
              className="shrink-0 text-slate-500"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search anything..."
              className="
                min-w-0
                flex-1
                bg-transparent
                text-sm
                text-slate-100
                outline-none
                placeholder:text-slate-500
              "
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="
                  rounded-md
                  p-1
                  text-slate-500
                  transition
                  hover:bg-slate-800/60
                  hover:text-slate-300
                "
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

            <div
              className="
                hidden
                items-center
                gap-1
                rounded-md
                border
                border-slate-800
                bg-slate-900/80
                px-2
                py-1
                text-[10px]
                font-medium
                text-slate-500
                xl:flex
              "
            >
              <Command size={11} />
              <span>K</span>
            </div>
          </div>

          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="
                  absolute
                  left-0
                  right-0
                  top-[calc(100%+10px)]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900/95
                  shadow-2xl
                  shadow-black/30
                  backdrop-blur-xl
                "
              >
                <div className="border-b border-slate-800 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Quick Search
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() =>
                          handleSearchSelect(item.path)
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          transition
                          hover:bg-slate-800/60
                        "
                      >
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-800
                            bg-slate-950/70
                            text-slate-400
                          "
                        >
                          {item.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-200">
                            {item.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Search
                        size={22}
                        className="mx-auto text-slate-600"
                      />

                      <p className="mt-3 text-sm font-medium text-slate-400">
                        No results found
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Try another search term.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* System status */}
          <div
            className="
              hidden
              items-center
              gap-2
              rounded-xl
              border
              border-slate-800
              bg-slate-950/60
              px-3
              py-2
              xl:flex
            "
          >
            <span className="relative flex h-2 w-2">
              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-emerald-400
                  opacity-60
                "
              />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-xs font-medium text-slate-400">
              Systems operational
            </span>
          </div>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={toggleNotification}
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-slate-800
                bg-slate-950/60
                text-slate-400
                transition
                hover:bg-slate-800/60
                hover:text-slate-200
              "
              aria-label="Notifications"
            >
              <Bell size={18} />

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-2
                  w-2
                  rounded-full
                  border-2
                  border-slate-950
                  bg-cyan-400
                "
              />
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    w-[340px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/95
                    shadow-2xl
                    shadow-black/30
                    backdrop-blur-xl
                  "
                >
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Notifications
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Latest workspace updates
                      </p>
                    </div>

                    <span
                      className="
                        rounded-full
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                        px-2
                        py-1
                        text-[10px]
                        font-semibold
                        text-cyan-300
                      "
                    >
                      2 new
                    </span>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      className="
                        flex
                        w-full
                        items-start
                        gap-3
                        rounded-xl
                        p-3
                        text-left
                        transition
                        hover:bg-slate-800/60
                      "
                    >
                      <div
                        className="
                          mt-0.5
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-cyan-400/10
                          text-cyan-300
                        "
                      >
                        <FileText size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200">
                          Document processing complete
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Your latest legal document is ready for analysis.
                        </p>

                        <p className="mt-2 text-[10px] font-medium text-slate-600">
                          Just now
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="
                        flex
                        w-full
                        items-start
                        gap-3
                        rounded-xl
                        p-3
                        text-left
                        transition
                        hover:bg-slate-800/60
                      "
                    >
                      <div
                        className="
                          mt-0.5
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-emerald-400/10
                          text-emerald-300
                        "
                      >
                        <ShieldCheck size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200">
                          Risk analysis updated
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          New insights are available in your risk analysis.
                        </p>

                        <p className="mt-2 text-[10px] font-medium text-slate-600">
                          12 min ago
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="border-t border-slate-800 p-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotificationOpen(false);
                        navigate("/dashboard");
                      }}
                      className="
                        w-full
                        rounded-xl
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-cyan-300
                        transition
                        hover:bg-cyan-400/10
                      "
                    >
                      View workspace
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={toggleProfile}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-800
                bg-slate-950/60
                px-2
                py-1.5
                transition
                hover:bg-slate-800/60
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-lg
                  bg-gradient-to-br
                  from-cyan-400
                  to-blue-500
                  text-xs
                  font-bold
                  text-white
                  shadow-lg
                  shadow-cyan-500/10
                "
              >
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt={profileName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarInitial
                )}
              </div>

              <div className="hidden max-w-[130px] text-left md:block">
                <p className="truncate text-xs font-semibold text-slate-200">
                  {profileName}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  {profile.role || "Administrator"}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`
                  hidden
                  text-slate-500
                  transition-transform
                  md:block
                  ${isProfileOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/95
                    shadow-2xl
                    shadow-black/30
                    backdrop-blur-xl
                  "
                >
                  <div className="bg-slate-800/40 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          bg-gradient-to-br
                          from-cyan-400
                          to-blue-500
                          text-sm
                          font-bold
                          text-white
                        "
                      >
                        {profile.photo ? (
                          <img
                            src={profile.photo}
                            alt={profileName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          avatarInitial
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-200">
                          {profileName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {profile.role || "Administrator"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/profile");
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        text-slate-300
                        transition
                        hover:bg-slate-800/60
                        hover:text-slate-100
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-slate-950/70
                          text-slate-400
                        "
                      >
                        <User size={15} />
                      </span>

                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/settings");
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        text-slate-300
                        transition
                        hover:bg-slate-800/60
                        hover:text-slate-100
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-slate-950/70
                          text-slate-400
                        "
                      >
                        <Settings size={15} />
                      </span>

                      Settings
                    </button>

                    <div className="my-2 h-px bg-slate-800" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        text-red-400
                        transition
                        hover:bg-red-500/10
                        hover:text-red-300
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          bg-red-500/10
                          text-red-400
                        "
                      >
                        <LogOut size={15} />
                      </span>

                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;