import { Link } from "react-router-dom";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl top-10 left-10"></div>

      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl bottom-0 right-0"></div>

      <Container>
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-cyan-400 font-semibold uppercase tracking-[0.25em] mb-5">
            AI-Powered Legal Intelligence
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Research Legal Cases
            <br />
            <span className="text-cyan-400">
              10× Faster with AI
            </span>
          </h1>

          <p className="mt-8 text-lg text-slate-300 max-w-3xl mx-auto leading-8">
            LexAI empowers students, advocates, law firms, and legal
            professionals with AI-driven document analysis, legal research,
            judgment comparison, compliance checking, and intelligent
            summaries in seconds.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">

            <Link
              to="/signup"
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                className="w-full sm:w-auto min-w-[190px] whitespace-nowrap"
              >
                Get Started
              </Button>
            </Link>

            <Button
              variant="secondary"
              className="w-full sm:w-auto min-w-[190px]"
            >
              Watch Demo
            </Button>

          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default Hero;