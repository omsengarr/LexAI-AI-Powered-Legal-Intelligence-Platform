import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBalanceScale,
  FaBars,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

import Container from "../ui/Container";
import Button from "../ui/Button";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    closeMenu();

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* ===================================================== */}
          {/* MAIN NAVBAR */}
          {/* ===================================================== */}

          <div className="relative rounded-[22px] border border-slate-700/60 bg-slate-950/80 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:rounded-full sm:px-5">
            <div className="flex items-center justify-between">
              {/* ================================================= */}
              {/* LOGO */}
              {/* ================================================= */}

              <Link
                to="/"
                onClick={closeMenu}
                className="group flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 transition-all duration-300 group-hover:border-cyan-400/60 group-hover:bg-cyan-400/20">
                  <FaBalanceScale className="text-cyan-400" />
                </div>

                <span className="text-xl font-bold tracking-tight text-white">
                  Lex<span className="text-cyan-400">AI</span>
                </span>
              </Link>

              {/* ================================================= */}
              {/* DESKTOP NAVIGATION */}
              {/* ================================================= */}

              <nav className="hidden items-center gap-8 lg:flex">
                <button
                  type="button"
                  onClick={() => scrollToSection("home")}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  Home
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("features")}
                  className="text-sm text-slate-300 transition hover:text-cyan-400"
                >
                  Features
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("about")}
                  className="text-sm text-slate-300 transition hover:text-cyan-400"
                >
                  About
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="text-sm text-slate-300 transition hover:text-cyan-400"
                >
                  Contact
                </button>
              </nav>

              {/* ================================================= */}
              {/* DESKTOP ACTIONS */}
              {/* ================================================= */}

              <div className="hidden items-center gap-3 sm:flex">
                <Link to="/login">
                  <Button
                    variant="secondary"
                    className="rounded-full px-5"
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button
                    variant="primary"
                    className="group flex items-center gap-2 rounded-full px-6"
                  >
                    Get Started

                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* ================================================= */}
              {/* MOBILE MENU BUTTON */}
              {/* ================================================= */}

              <button
                type="button"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 lg:hidden"
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>

            {/* ===================================================== */}
            {/* MOBILE MENU */}
            {/* ===================================================== */}

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="overflow-hidden lg:hidden"
                >
                  <div className="mt-4 border-t border-slate-800 pt-4">
                    {/* Mobile navigation links */}

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => scrollToSection("home")}
                        className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        Home
                      </button>

                      <button
                        type="button"
                        onClick={() => scrollToSection("features")}
                        className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        Features
                      </button>

                      <button
                        type="button"
                        onClick={() => scrollToSection("about")}
                        className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        About
                      </button>

                      <button
                        type="button"
                        onClick={() => scrollToSection("contact")}
                        className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        Contact
                      </button>
                    </div>

                    {/* Mobile actions */}

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:text-white"
                      >
                        Login
                      </Link>

                      <Link
                        to="/signup"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                      >
                        Get Started
                        <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Navbar;