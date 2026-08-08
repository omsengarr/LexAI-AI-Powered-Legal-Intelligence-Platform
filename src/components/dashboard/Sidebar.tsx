import { useState } from "react";

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

import {
  FaBars,
  FaTimes,
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

  const [mobileOpen, setMobileOpen] = useState(false);


  return (
    <>
      {/* ================================= */}
      {/* Mobile Menu Button */}
      {/* ================================= */}

      <button
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          top-4
          left-4
          z-[60]
          md:hidden
          w-11
          h-11
          rounded-xl
          bg-slate-900
          border
          border-slate-800
          text-white
          flex
          items-center
          justify-center
          shadow-lg
        "
        aria-label="Open menu"
      >
        <FaBars size={20} />
      </button>


      {/* ================================= */}
      {/* Mobile Overlay */}
      {/* ================================= */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            bg-black/60
            z-40
            md:hidden
          "
        />
      )}


      {/* ================================= */}
      {/* Sidebar */}
      {/* ================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          h-screen
          w-72
          bg-slate-950
          border-r
          border-slate-800
          flex
          flex-col
          z-50

          transform
          transition-transform
          duration-300
          ease-in-out

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >


        {/* ================================= */}
        {/* Logo */}
        {/* ================================= */}

        <div className="
          px-6
          py-6
          border-b
          border-slate-800
        ">

          <div className="
            flex
            items-center
            justify-between
          ">


            <div className="
              flex
              items-center
              gap-4
            ">


              {/* Logo Icon */}

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-cyan-500
                  flex
                  items-center
                  justify-center
                  text-white
                  text-2xl
                  shadow-lg
                "
              >
                ⚖️
              </div>


              {/* Logo Text */}

              <div>

                <h1 className="
                  text-2xl
                  font-bold
                  text-white
                ">
                  LexAI
                </h1>

                <p className="
                  text-sm
                  text-slate-400
                ">
                  Legal Intelligence Platform
                </p>

              </div>

            </div>


            {/* Mobile Close Button */}

            <button
              onClick={() => setMobileOpen(false)}
              className="
                md:hidden
                text-slate-400
                hover:text-white
                transition
              "
              aria-label="Close menu"
            >
              <FaTimes size={22} />
            </button>


          </div>

        </div>


        {/* ================================= */}
        {/* Navigation */}
        {/* ================================= */}

        <nav className="
          flex-1
          px-5
          py-6
          space-y-2
          overflow-y-auto
        ">

          {menuItems.map((item) => (

            <NavLink
              key={item.name}
              to={item.path}

              onClick={() => setMobileOpen(false)}

              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-4
                  w-full
                  px-5
                  py-4
                  rounded-xl
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "bg-cyan-500 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `
              }
            >

              {/* Icon */}

              <span className="
                text-xl
                shrink-0
              ">
                {item.icon}
              </span>


              {/* Menu Name */}

              <span className="
                font-medium
              ">
                {item.name}
              </span>

            </NavLink>

          ))}

        </nav>


        {/* ================================= */}
        {/* User Section */}
        {/* ================================= */}

        <div className="
          border-t
          border-slate-800
          p-6
        ">


          <div className="
            flex
            items-center
            gap-4
          ">


            {/* Avatar */}

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-cyan-500
                flex
                items-center
                justify-center
                text-white
                font-bold
                text-lg
              "
            >
              O
            </div>


            {/* User Information */}

            <div>

              <h3 className="
                text-white
                font-semibold
              ">
                Om Sengar
              </h3>

              <p className="
                text-slate-400
                text-sm
              ">
                Frontend Developer
              </p>

            </div>

          </div>


          {/* Version */}

          <div className="
            mt-5
            text-xs
            text-slate-500
          ">
            LexAI v1.0.0
          </div>


        </div>


      </aside>
    </>
  );
}


export default Sidebar;