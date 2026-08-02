import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-slate-950 text-white px-6">
      <div className="max-w-4xl text-center">

        <p className="text-cyan-400 font-semibold mb-4">
          AI-Powered Legal Intelligence
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Research Legal Cases
          <br />
          10x Faster with AI
        </h1>

        <p className="mt-8 text-lg text-slate-300 max-w-2xl mx-auto">
          LexAI helps law students, advocates, and legal professionals
          analyze legal documents, summarize judgments, compare cases,
          and perform intelligent legal research in seconds.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">

          <Link
            to="/signup"
            className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl font-semibold transition"
          >
            Start Free
          </Link>

          <button
            className="border border-slate-600 hover:border-cyan-400 px-8 py-4 rounded-xl transition"
          >
            Watch Demo
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;