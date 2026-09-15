import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../ui/Container";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBalanceScale,
  FaFileAlt,
  FaRobot,
  FaSearch,
  FaPlay,
} from "react-icons/fa";
import DemoModal from "./DemoModal";

function Hero() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#020617] text-white"
    >
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main cyan glow */}
        <div className="absolute left-1/2 top-[-250px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

        {/* Left blue glow */}
        <div className="absolute left-[5%] top-[35%] h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[120px]" />

        {/* Right cyan glow */}
        <div className="absolute right-[5%] top-[45%] h-[400px] w-[400px] rounded-full bg-cyan-400/5 blur-[120px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#020617] to-transparent" />
      </div>

      <Container>
        <div className="relative z-10 pb-24 pt-36">
          {/* ========================================================= */}
          {/* EYEBROW */}
          {/* ========================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />

              <span className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-300">
                AI-Powered Legal Intelligence
              </span>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* MAIN HEADING */}
          {/* ========================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto max-w-6xl text-center"
          >
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-8xl lg:text-[7.5rem]">
              Research Legal Cases

              <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                10× Faster with AI
              </span>
            </h1>

            <p className="mx-auto mt-10 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Search cases, understand complex judgments, analyze legal
              documents, and get intelligent insights — all from one
              powerful legal workspace.
            </p>
          </motion.div>

          {/* ========================================================= */}
          {/* CTA BUTTONS */}
          {/* ========================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {/* Start Researching */}
            <Link to="/signup">
              <button
                type="button"
                className="group flex items-center gap-3 rounded-full bg-cyan-400 px-7 py-3.5 font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:bg-cyan-300"
              >
                Start Researching

                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>

            {/* Watch Demo */}
            <button
              type="button"
              onClick={() => setIsDemoOpen(true)}
              className="group flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/60 px-7 py-3.5 font-medium text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-800"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 transition group-hover:border-cyan-400/50">
                <FaPlay className="ml-0.5 text-[9px] text-cyan-400" />
              </span>

              Watch Demo
            </button>

            {/* Explore LexAI */}
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden rounded-full border border-slate-800 bg-transparent px-7 py-3.5 font-medium text-slate-400 transition-all duration-300 hover:border-slate-600 hover:text-white sm:block"
            >
              Explore LexAI
            </button>
          </motion.div>

          {/* ========================================================= */}
          {/* PRODUCT PREVIEW */}
          {/* ========================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
            className="relative mx-auto mt-20 max-w-6xl"
          >
            {/* Glow behind product */}
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

            <div className="relative overflow-hidden rounded-[28px] border border-slate-700/70 bg-slate-900/80 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
              {/* ===================================================== */}
              {/* BROWSER HEADER */}
              {/* ===================================================== */}

              <div className="flex items-center justify-between rounded-t-[22px] border-b border-slate-800 bg-slate-950 px-5 py-4">
                {/* Browser dots */}
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-slate-700" />
                  <span className="h-3 w-3 rounded-full bg-slate-700" />
                  <span className="h-3 w-3 rounded-full bg-slate-700" />
                </div>

                {/* Workspace title */}
                <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-1.5 text-xs text-slate-500 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  LexAI Workspace
                </div>

                <div className="w-16" />
              </div>

              {/* ===================================================== */}
              {/* DASHBOARD */}
              {/* ===================================================== */}

              <div className="grid min-h-[420px] grid-cols-1 bg-[#050914] md:grid-cols-[210px_1fr]">
                {/* =================================================== */}
                {/* SIDEBAR */}
                {/* =================================================== */}

                <div className="hidden border-r border-slate-800 p-5 md:block">
                  {/* Logo */}
                  <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
                      <FaBalanceScale className="text-sm text-cyan-400" />
                    </div>

                    <span className="font-semibold text-white">LexAI</span>
                  </div>

                  {/* Sidebar items */}
                  <div className="space-y-2">
                    {/* Overview */}
                    <div className="flex items-center gap-3 rounded-xl bg-cyan-400/10 px-3 py-3 text-sm text-cyan-300">
                      <FaSearch />
                      Overview
                    </div>

                    {/* Documents */}
                    <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
                      <FaFileAlt />
                      Documents
                    </div>

                    {/* AI Assistant */}
                    <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
                      <FaRobot />
                      AI Assistant
                    </div>

                    {/* Case Research */}
                    <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
                      <FaBalanceScale />
                      Case Research
                    </div>
                  </div>
                </div>

                {/* =================================================== */}
                {/* MAIN DASHBOARD */}
                {/* =================================================== */}

                <div className="p-5 sm:p-8">
                  {/* Heading */}
                  <div className="mb-7">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                      Legal Intelligence
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                      Good afternoon, Legal Researcher
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      What would you like to research today?
                    </p>
                  </div>

                  {/* ================================================= */}
                  {/* SEARCH */}
                  {/* ================================================= */}

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4 shadow-inner">
                    <FaSearch className="shrink-0 text-slate-500" />

                    <span className="truncate text-sm text-slate-500">
                      Search cases, judgments, statutes or legal topics...
                    </span>

                    <div className="ml-auto hidden shrink-0 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 sm:block">
                      Search
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* STAT CARDS */}
                  {/* ================================================= */}

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {/* Documents */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-400/20">
                      <FaFileAlt className="text-cyan-400" />

                      <p className="mt-4 text-2xl font-semibold text-white">
                        1,284
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Documents analyzed
                      </p>
                    </div>

                    {/* Cases */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-400/20">
                      <FaBalanceScale className="text-cyan-400" />

                      <p className="mt-4 text-2xl font-semibold text-white">
                        642
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Cases researched
                      </p>
                    </div>

                    {/* AI */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-400/20">
                      <FaRobot className="text-cyan-400" />

                      <p className="mt-4 text-2xl font-semibold text-white">
                        AI
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Intelligence ready
                      </p>
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* AI INSIGHT */}
                  {/* ================================================= */}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1 }}
                    className="mt-4 rounded-2xl border border-cyan-400/10 bg-gradient-to-r from-cyan-400/5 to-blue-500/5 p-5"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                        <FaRobot className="text-cyan-400" />
                      </div>

                      {/* Text */}
                      <div>
                        <p className="text-sm font-medium text-white">
                          AI Research Assistant
                        </p>

                        <p className="text-xs text-slate-500">
                          Ready to analyze your next legal question
                        </p>
                      </div>

                      {/* Status */}
                      <div className="ml-auto flex items-center gap-2">
                        <span className="hidden text-xs text-emerald-400 sm:block">
                          Online
                        </span>

                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
                      </div>
                    </div>
                  </motion.div>

                  {/* ================================================= */}
                  {/* BOTTOM MINI CARDS */}
                  {/* ================================================= */}

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-cyan-400" />

                        <span className="text-xs text-slate-400">
                          Relevant cases identified
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-cyan-400" />

                        <span className="text-xs text-slate-400">
                          Key legal concepts extracted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* SCROLL INDICATOR */}
          {/* ========================================================= */}

          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            className="mt-12 flex flex-col items-center justify-center gap-2 text-slate-600"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">
              Scroll
            </span>

            <span className="text-lg">↓</span>
          </motion.div>
        </div>
      </Container>

      {/* ========================================================= */}
      {/* DEMO MODAL */}
      {/* ========================================================= */}

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </section>
  );
}

export default Hero;