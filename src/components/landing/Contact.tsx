import { useState } from "react";

import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBalanceScale,
  FaCheck,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#020617] py-28 text-white sm:py-36"
    >
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-150px] top-[20%] h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[140px]" />

        <div className="absolute right-[-150px] bottom-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-cyan-400" />

              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
                Contact
              </span>
            </div>

            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Let's build a
              <span className="block text-slate-500">
                smarter legal workflow.
              </span>
            </h2>
          </div>

          <div className="lg:flex lg:justify-end">
            <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base">
              Have a question about LexAI, the platform, or your legal
              research workflow? Send us a message and our team can help.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN CONTACT AREA */}
        {/* ========================================================= */}

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          {/* ======================================================= */}
          {/* LEFT INFORMATION CARD */}
          {/* ======================================================= */}

          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/70 p-7 backdrop-blur-xl sm:p-9"
          >
            {/* Glow */}
            <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-[110px]" />

            <div className="relative z-10">
              {/* Brand icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <FaBalanceScale className="text-xl text-cyan-400" />
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Get in touch
              </p>

              <h3 className="mt-4 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Questions are always welcome.
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                Whether you're exploring LexAI for legal research, document
                analysis, compliance, or AI assistance, we'd love to hear
                from you.
              </p>

              {/* =================================================== */}
              {/* CONTACT DETAILS */}
              {/* =================================================== */}

              <div className="mt-9 space-y-5 border-t border-slate-800 pt-7">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-cyan-400">
                    <FaEnvelope className="text-sm" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      support@lexai.com
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-cyan-400">
                    <FaPhone className="text-sm" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      Support
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      Available through LexAI
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-cyan-400">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      Platform
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      AI-Powered Legal Intelligence
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================== */}
              {/* STATUS */}
              {/* =================================================== */}

              <div className="mt-9 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10">
                    <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-30" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-emerald-400">
                      LexAI support is available
                    </p>

                    <p className="mt-1 text-[10px] text-slate-600">
                      Send your message and we'll get back to you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-7 flex items-center gap-2 text-xs text-slate-600">
                <FaCheck className="text-cyan-400" />

                <span>Built for modern legal professionals</span>
              </div>
            </div>
          </motion.div>

          {/* ======================================================= */}
          {/* CONTACT FORM */}
          {/* ======================================================= */}

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/70 p-7 backdrop-blur-xl sm:p-9"
          >
            <div className="relative z-10">
              {/* Form header */}
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                    Send a message
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    Tell us how we can help.
                  </h3>
                </div>

                <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 sm:flex">
                  <FaPaperPlane className="text-sm text-cyan-400" />
                </div>
              </div>

              {/* =================================================== */}
              {/* FORM */}
              {/* =================================================== */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-medium text-slate-400"
                    >
                      Your name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/40 focus:bg-slate-900"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-medium text-slate-400"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/40 focus:bg-slate-900"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="What would you like to discuss?"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/40 focus:bg-slate-900"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-medium text-slate-400"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us a little about what you need..."
                    className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/40 focus:bg-slate-900"
                  />
                </div>

                {/* Submit */}
                <div className="flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs text-[10px] leading-5 text-slate-700">
                    By sending this message, you agree to communicate with
                    the LexAI team regarding your request.
                  </p>

                  <button
                    type="submit"
                    className="group flex items-center justify-center gap-3 rounded-full bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/10"
                  >
                    {submitted ? "Message Sent" : "Send Message"}

                    {submitted ? (
                      <FaCheck className="text-xs" />
                    ) : (
                      <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </button>
                </div>
              </form>

              {/* =================================================== */}
              {/* SUCCESS MESSAGE */}
              {/* =================================================== */}

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FaCheck className="text-xs text-emerald-400" />

                    <p className="text-xs text-emerald-400">
                      Your message has been received. Thank you for reaching
                      out to LexAI.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM CTA */}
        {/* ========================================================= */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 flex flex-col gap-5 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40" />

            <span className="text-xs uppercase tracking-[0.2em] text-slate-600">
              LexAI · Legal Intelligence Platform
            </span>
          </div>

          <a
            href="#home"
            className="group flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-cyan-400"
          >
            Back to top

            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              ↑
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;