import { Link } from "react-router-dom";
import {
  FaBalanceScale,
  FaArrowUp,
  FaGithub,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-[#01040c] text-white">
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-200px] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* ========================================================= */}
        {/* MAIN FOOTER */}
        {/* ========================================================= */}

        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr]">
          {/* ======================================================= */}
          {/* BRAND */}
          {/* ======================================================= */}

          <div className="max-w-md">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 transition duration-300 group-hover:border-cyan-400/60 group-hover:bg-cyan-400/20">
                <FaBalanceScale className="text-cyan-400" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Lex<span className="text-cyan-400">AI</span>
              </span>
            </Link>

            <p className="mt-6 text-sm leading-7 text-slate-500">
              AI-powered legal intelligence for faster research, smarter
              document analysis, and better legal workflows.
            </p>

            {/* Status */}
            <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-4 py-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-400">
                Platform operational
              </span>
            </div>
          </div>

          {/* ======================================================= */}
          {/* PRODUCT */}
          {/* ======================================================= */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Product
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="block text-sm text-slate-600 transition hover:text-cyan-400"
              >
                Features
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("faq")}
                className="block text-sm text-slate-600 transition hover:text-cyan-400"
              >
                FAQ
              </button>

              <Link
                to="/login"
                className="block text-sm text-slate-600 transition hover:text-cyan-400"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="block text-sm text-slate-600 transition hover:text-cyan-400"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* ======================================================= */}
          {/* COMPANY */}
          {/* ======================================================= */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Company
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => scrollToSection("about")}
                className="block text-sm text-slate-600 transition hover:text-cyan-400"
              >
                About
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="block text-sm text-slate-600 transition hover:text-cyan-400"
              >
                Contact
              </button>

              <a
                href="#faq"
                className="block text-sm text-slate-600 transition hover:text-cyan-400"
              >
                Help Center
              </a>

              <a
                href="#contact"
                className="block text-sm text-slate-600 transition hover:text-cyan-400"
              >
                Support
              </a>
            </div>
          </div>

          {/* ======================================================= */}
          {/* SOCIAL */}
          {/* ======================================================= */}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Connect
            </p>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-600">
              Follow the project and stay connected with the LexAI platform.
            </p>

            <div className="mt-6 flex gap-3">
              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-slate-500 transition duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-400"
              >
                <FaGithub className="text-sm" />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-slate-500 transition duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-400"
              >
                <FaLinkedinIn className="text-sm" />
              </a>

              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-slate-500 transition duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-400"
              >
                <FaTwitter className="text-sm" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DIVIDER */}
        {/* ========================================================= */}

        <div className="my-12 h-px bg-slate-800" />

        {/* ========================================================= */}
        {/* BOTTOM FOOTER */}
        {/* ========================================================= */}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-slate-600">
              © 2026 LexAI. All Rights Reserved.
            </p>

            <p className="mt-2 text-[10px] text-slate-700">
              AI-Powered Legal Intelligence Platform
            </p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-xs text-slate-600 transition hover:text-slate-300"
            >
              Privacy
            </a>

            <a
              href="#"
              className="text-xs text-slate-600 transition hover:text-slate-300"
            >
              Terms
            </a>

            {/* Back to top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="group flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-500 transition duration-300 hover:border-cyan-400/30 hover:text-cyan-400"
            >
              Back to top

              <FaArrowUp className="text-[9px] transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;