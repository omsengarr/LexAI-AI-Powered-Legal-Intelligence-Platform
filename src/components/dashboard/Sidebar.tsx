import {
  FaHome,
  FaUpload,
  FaComments,
  FaSearch,
  FaShieldAlt,
  FaClipboardCheck,
  FaChartBar,
  FaUser,
  FaCog,
  FaGavel,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: <FaHome />,
    path: "/dashboard",
  },
  {
    name: "Upload Documents",
    icon: <FaUpload />,
    path: "/documents/upload",
  },
  {
    name: "AI Chat",
    icon: <FaComments />,
    path: "/chat",
  },
  {
    name: "Case Search",
    icon: <FaSearch />,
    path: "/cases",
  },
  {
    name: "Risk Analysis",
    icon: <FaShieldAlt />,
    path: "/risk-analysis",
  },
  {
    name: "Compliance",
    icon: <FaClipboardCheck />,
    path: "/compliance",
  },
  {
    name: "Analytics",
    icon: <FaChartBar />,
    path: "/analytics",
  },
  {
    name: "Judgment Comparison",
    icon: <FaGavel />,
    path: "/comparison",
  },
  {
    name: "Profile",
    icon: <FaUser />,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: <FaCog />,
    path: "/settings",
  },
];

function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg">
            ⚖️
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              LexAI
            </h1>

            <p className="text-sm text-slate-400">
              Legal Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>

            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-800 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
            O
          </div>

          <div>
            <h3 className="text-white font-semibold">
              Om Sengar
            </h3>

            <p className="text-slate-400 text-sm">
              Frontend Developer
            </p>
          </div>
        </div>

        <div className="mt-5 text-xs text-slate-500">
          LexAI v1.0.0
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;