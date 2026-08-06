import {
  FaHome,
  FaUpload,
  FaComments,
  FaSearch,
  FaShieldAlt,
  FaBalanceScale,
  FaUser,
  FaCog,
} from "react-icons/fa";

import { Link } from "react-router-dom";

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
    name: "Judgment Comparison",
    icon: <FaBalanceScale />,
    path: "/judgment-comparison",
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
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-10">
        ⚖️ LexAI
      </h1>

      <nav className="space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-all duration-300"
          >
            <span className="text-lg">{item.icon}</span>

            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;