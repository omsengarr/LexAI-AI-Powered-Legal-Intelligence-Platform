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
} from "lucide-react";

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
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Documents",
        path: "/documents/upload",
        icon: FileText,
      },
      {
        label: "AI Chat",
        path: "/chat",
        icon: MessageSquare,
      },
      {
        label: "Case Search",
        path: "/cases",
        icon: Search,
      },
    ],
  },
  {
    title: "Intelligence",
    items: [
      {
        label: "Risk Analysis",
        path: "/risk-analysis",
        icon: ShieldCheck,
      },
      {
        label: "Compliance",
        path: "/compliance",
        icon: BriefcaseBusiness,
      },
      {
        label: "Analytics",
        path: "/analytics",
        icon: BarChart3,
      },
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
      {
        label: "Profile",
        path: "/profile",
        icon: User,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

function Sidebar({
  mobileOpen: controlledMobileOpen,
  setMobileOpen: controlledSetMobileOpen,
}: SidebarProps) {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const mobileOpen =
    controlledMobileOpen !== undefined
      ? controlledMobileOpen
      : internalMobileOpen;

  const setMobileOpen =
    controlledSetMobileOpen || setInternalMobileOpen;

  const userEmail =
    localStorage.getItem("lexai_user_email") || "admin@lexai.demo";

  const handleLogout = () => {
    localStorage.removeItem("lexai_authenticated");
    localStorage.removeItem("lexai_user_email");

    window.location.href = "/login";
  };

  const sidebarContent = (
    <div
      className="
        flex
        h-full
        flex-col
        bg-slate-950/95
        backdrop-blur-xl
      "
    >
      {/* Logo */}
      <div
        className="
          flex
          h-20
          shrink-0
          items-center
          justify-between
          border-b
          border-slate-800/70
          px-5
        "
      >
        <Link
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3"
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-cyan-400
              text-white
              shadow-lg
              shadow-cyan-500/20
            "
          >
            <Scale size={21} strokeWidth={2.2} />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-white">
              LexAI
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Legal Intelligence
            </p>
          </div>
        </Link>

        {/* Mobile close */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-slate-800
            bg-slate-900/70
            text-slate-400
            transition
            hover:bg-slate-800/60
            hover:text-slate-200
            md:hidden
          "
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Workspace status */}
      <div className="px-4 pt-5">
        <div
          className="
            rounded-2xl
            border
            border-slate-800/80
            bg-slate-900/60
            p-3
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-cyan-400/10
                text-cyan-300
              "
            >
              <Activity size={17} />
            </div>

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
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-7">
          {navSections.map((section) => (
            <div key={section.title}>
              <p
                className="
                  mb-2
                  px-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-600
                "
              >
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => `
                        group
                        relative
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition-all
                        duration-200
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
                              className="
                                absolute
                                left-0
                                top-1/2
                                h-6
                                w-0.5
                                -translate-y-1/2
                                rounded-full
                                bg-cyan-400
                              "
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 35,
                              }}
                            />
                          )}

                          <span
                            className={`
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              transition
                              ${
                                isActive
                                  ? "bg-cyan-400/10 text-cyan-300"
                                  : "bg-slate-900/60 text-slate-500 group-hover:bg-slate-800/70 group-hover:text-slate-300"
                              }
                            `}
                          >
                            <Icon size={17} />
                          </span>

                          <span className="min-w-0 flex-1 truncate">
                            {item.label}
                          </span>

                          <ChevronRight
                            size={14}
                            className={`
                              shrink-0
                              transition-all
                              ${
                                isActive
                                  ? "translate-x-0 text-cyan-400 opacity-100"
                                  : "-translate-x-1 text-slate-700 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                              }
                            `}
                          />
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
        <div
          className="
            mt-7
            overflow-hidden
            rounded-2xl
            border
            border-cyan-400/10
            bg-gradient-to-br
            from-cyan-400/[0.07]
            via-slate-900/40
            to-slate-950/50
            p-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-cyan-400/10
                text-cyan-300
              "
            >
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
      </nav>

      {/* User / Footer */}
      <div className="shrink-0 border-t border-slate-800/70 p-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-2 py-2">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-cyan-400
              to-blue-500
              text-xs
              font-bold
              text-white
            "
          >
            {userEmail.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-300">
              {userEmail}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-600">
              Workspace administrator
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-sm
            font-medium
            text-slate-500
            transition
            hover:bg-slate-800/60
            hover:text-slate-200
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
              bg-slate-900/70
              text-slate-500
              transition
              group-hover:bg-slate-800
              group-hover:text-slate-300
            "
          >
            <LogOut size={15} />
          </span>

          <span>Sign out</span>
        </button>

        <p className="mt-3 px-3 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-700">
          LexAI • Legal Intelligence Platform
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          left-4
          top-4
          z-50
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-slate-800
          bg-slate-950/90
          text-slate-300
          shadow-xl
          backdrop-blur-xl
          transition
          hover:bg-slate-800/70
          md:hidden
        "
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      {/* Desktop sidebar */}
      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-[270px]
          border-r
          border-slate-800/70
          md:block
        "
      >
        {sidebarContent}
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
              className="
                fixed
                inset-0
                z-40
                bg-slate-950/70
                backdrop-blur-sm
                md:hidden
              "
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
              className="
                fixed
                inset-y-0
                left-0
                z-50
                w-[285px]
                border-r
                border-slate-800/70
                md:hidden
              "
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;