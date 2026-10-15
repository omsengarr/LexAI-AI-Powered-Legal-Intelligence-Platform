
import { useState, type ElementType } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  Gavel,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  User,
  X,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { useUserPreferences } from "../../context/UserPreferencesContext";

interface NavItem {
  label: string;
  path: string;
  icon: ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Documents", path: "/documents/upload", icon: FileText },
      {
        label: "Page Lock & Analysis",
        path: "/documents/analyze",
        icon: LockKeyhole,
      },
      { label: "AI Chat", path: "/chat", icon: MessageSquare },
      { label: "Case Search", path: "/cases", icon: Search },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Risk Analysis", path: "/risk-analysis", icon: ShieldCheck },
      {
        label: "Compliance",
        path: "/compliance",
        icon: BriefcaseBusiness,
      },
      { label: "Analytics", path: "/analytics", icon: BarChart3 },
      {
        label: "Judgment Comparison",
        path: "/comparison",
        icon: Gavel,
      },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Profile", path: "/profile", icon: User },
      { label: "Settings", path: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function Sidebar({
  mobileOpen: controlledMobileOpen,
  setMobileOpen: controlledSetMobileOpen,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const { profile } = useUserPreferences();

  const mobileOpen =
    controlledMobileOpen !== undefined
      ? controlledMobileOpen
      : internalMobileOpen;

  const setMobileOpen =
    controlledSetMobileOpen || setInternalMobileOpen;

  const userEmail = profile.email || "admin@lexai.demo";
  const profileName = profile.fullName.trim() || userEmail;
  const avatarInitial = profileName.charAt(0).toUpperCase() || "L";

  const handleLogout = () => {
    localStorage.removeItem("lexai_authenticated");
    localStorage.removeItem("lexai_user_email");
    window.location.href = "/login";
  };

  const sidebarContent = (compact: boolean) => (
    <div className="relative flex h-full flex-col bg-slate-950/95 backdrop-blur-xl">
      {/* Logo and collapse control */}
      <div
        className={`relative flex h-20 shrink-0 items-center border-b border-slate-800/70 ${
          compact ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        <Link
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          title="LexAI Dashboard"
          className={`flex min-w-0 items-center ${
            compact ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-white shadow-lg shadow-cyan-500/20">
            <Scale size={21} strokeWidth={2.2} />
          </div>

          <div className={compact ? "hidden" : "min-w-0"}>
            <p className="text-base font-bold tracking-tight text-white">
              LexAI
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Legal Intelligence
            </p>
          </div>
        </Link>

        {!compact && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200 md:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}

        {/* Desktop collapse button: visible in expanded mode */}
        {!compact && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-cyan-300 shadow-sm transition hover:border-cyan-400 hover:bg-slate-800 md:flex"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Expand button: shown below the logo in compact mode */}
      {compact && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute right-3 top-[84px] z-[60] flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/50 bg-slate-900 text-cyan-300 shadow-lg transition hover:bg-slate-800"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <PanelLeftOpen size={18} />
        </button>
      )}

      {/* Workspace status */}
      <div className={`pt-5 ${compact ? "px-2" : "px-4"}`}>
        <div
          title={
            compact ? "Workspace - All systems operational" : undefined
          }
          className={`rounded-2xl border border-slate-800/80 bg-slate-900/60 ${
            compact ? "flex justify-center p-2" : "p-3"
          }`}
        >
          <div
            className={`flex items-center ${
              compact ? "justify-center" : "gap-3"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Activity size={17} />
            </div>

            {!compact && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-300">
                  Workspace
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-medium text-slate-500">
                    All systems operational
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`min-h-0 flex-1 overflow-y-auto py-6 ${
          compact ? "px-2" : "px-4"
        }`}
      >
        <div className={compact ? "space-y-5" : "space-y-7"}>
          {navSections.map((section) => (
            <div key={section.title}>
              {!compact && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={compact ? item.label : undefined}
                      className={({ isActive }) => `
                        group relative flex items-center rounded-xl
                        py-2.5 text-sm font-medium transition-all duration-200
                        ${compact ? "justify-center px-1" : "gap-3 px-3"}
                        ${
                          isActive
                            ? "bg-cyan-400/10 text-cyan-300"
                            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="active-sidebar-indicator"
                              className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400"
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 35,
                              }}
                            />
                          )}

                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                              isActive
                                ? "bg-cyan-400/10 text-cyan-300"
                                : "bg-slate-900/60 text-slate-500 group-hover:bg-slate-800/70 group-hover:text-slate-300"
                            }`}
                          >
                            <Icon size={17} />
                          </span>

                          {!compact && (
                            <>
                              <span className="min-w-0 flex-1 truncate">
                                {item.label}
                              </span>

                              <ChevronRight
                                size={14}
                                className={`shrink-0 transition-all ${
                                  isActive
                                    ? "translate-x-0 text-cyan-400 opacity-100"
                                    : "-translate-x-1 text-slate-700 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                }`}
                              />
                            </>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* AI status */}
        {!compact && (
          <div className="mt-7 overflow-hidden rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.07] via-slate-900/40 to-slate-950/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Zap size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-200">
                  LexAI Intelligence
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  AI services are ready
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-500">
                AI Engine
              </span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-400">
                  Online
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* User and footer */}
      <div
        className={`shrink-0 border-t border-slate-800/70 ${
          compact ? "p-2" : "p-4"
        }`}
      >
        <div
          title={compact ? profileName : undefined}
          className={`mb-2 flex items-center rounded-xl py-2 ${
            compact ? "justify-center px-0" : "gap-3 px-2"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
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

          {!compact && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-300">
                {profileName}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-600">
                {profile.role || "Workspace administrator"}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title={compact ? "Sign out" : undefined}
          className={`group flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-800/60 hover:text-slate-200 ${
            compact ? "justify-center px-0" : "gap-3 px-3"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900/70 text-slate-500 transition group-hover:bg-slate-800 group-hover:text-slate-300">
            <LogOut size={15} />
          </span>

          {!compact && <span>Sign out</span>}
        </button>

        {!compact && (
          <p className="mt-3 px-3 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-700">
            LexAI - Legal Intelligence Platform
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/90 text-slate-300 shadow-xl backdrop-blur-xl transition hover:bg-slate-800/70 md:hidden"
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-800/70 transition-[width] duration-300 md:block ${
          collapsed ? "w-[76px]" : "w-[270px]"
        }`}
      >
        {sidebarContent(collapsed)}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 32,
              }}
              className="fixed inset-y-0 left-0 z-50 w-[285px] border-r border-slate-800/70 md:hidden"
            >
              {sidebarContent(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
