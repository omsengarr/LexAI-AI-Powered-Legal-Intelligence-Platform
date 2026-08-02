import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-cyan-400"
        >
          ⚖️ LexAI
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">

          <a
            href="#"
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            Home
          </a>

          <a
            href="#"
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            Features
          </a>

          <a
            href="#"
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            About
          </a>

          <a
            href="#"
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            Contact
          </a>

        </div>

        {/* Buttons */}
        <div className="flex gap-4">

          <Link
            to="/login"
            className="text-white hover:text-cyan-400 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg transition"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;