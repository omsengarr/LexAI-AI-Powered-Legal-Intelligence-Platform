import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <Container>
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold text-cyan-400"
          >
            ⚖️ LexAI
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">

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

          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            <Link to="/login">
              <Button variant="secondary">
                Login
              </Button>
            </Link>

            <Link to="/signup">
              <Button variant="primary">
                Get Started
              </Button>
            </Link>

          </div>

        </div>
      </Container>
    </header>
  );
}

export default Navbar;