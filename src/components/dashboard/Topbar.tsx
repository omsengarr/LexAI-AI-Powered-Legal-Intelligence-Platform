import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Topbar() {
  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400">
          Welcome back to LexAI 👋
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-800 text-white pl-11 pr-4 py-3 rounded-xl w-72 outline-none border border-slate-700 focus:border-cyan-400"
          />
        </div>

        <button className="text-slate-300 hover:text-cyan-400 text-xl transition">
          <FaBell />
        </button>

        <button className="text-slate-300 hover:text-cyan-400 text-3xl transition">
          <FaUserCircle />
        </button>

      </div>

    </header>
  );
}

export default Topbar;