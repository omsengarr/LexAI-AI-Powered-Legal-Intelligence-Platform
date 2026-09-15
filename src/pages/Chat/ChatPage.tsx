import { useState } from "react";

import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";

import { sendChatMessage } from "../../services/api";

import {
  Bot,
  ShieldCheck,
  Sparkles,
  Brain,
  Zap,
  LockKeyhole,
} from "lucide-react";


interface Message {
  text: string;
  sender: "user" | "ai";
}


function ChatPage() {

  const [messages, setMessages] = useState<Message[]>([
    {
      text:
        "Hello! I am your AI Legal Assistant. How can I help you today?",
      sender: "ai",
    },
  ]);


  const [loading, setLoading] = useState(false);


  // ========================================
  // Handle User Message
  // ========================================

  const handleSend = async (
    message: string
  ) => {

    if (!message.trim()) {
      return;
    }


    const userMessage = message.trim();


    // ========================================
    // Add User Message
    // ========================================

    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        sender: "user",
      },
    ]);


    // ========================================
    // Start Loading
    // ========================================

    setLoading(true);


    // ========================================
    // Send Message To Backend
    // ========================================

    try {

      const result =
        await sendChatMessage(
          userMessage
        );


      console.log(
        "Chat response:",
        result
      );


      // ======================================
      // Add AI Response
      // ======================================

      setMessages((prev) => [
        ...prev,
        {
          text:
            result.response ||
            "I received your question, but no response was returned.",
          sender: "ai",
        },
      ]);


    } catch (error) {

      console.error(
        "Chat request failed:",
        error
      );


      // ======================================
      // Display Error
      // ======================================

      setMessages((prev) => [
        ...prev,
        {
          text:
            "Sorry, I couldn't connect to the LexAI backend. Please make sure the backend server is running.",
          sender: "ai",
        },
      ]);


    } finally {

      // ======================================
      // Stop Loading
      // ======================================

      setLoading(false);

    }

  };


  // ========================================
  // Chat UI
  // ========================================

  return (

    <div className="relative w-full space-y-8 pb-6">

      {/* ========================================
          Ambient Background
      ======================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div
          className="
            absolute
            left-[15%]
            top-[-12%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-cyan-500/[0.035]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            right-[5%]
            top-[30%]
            h-[360px]
            w-[360px]
            rounded-full
            bg-purple-500/[0.025]
            blur-[120px]
          "
        />

      </div>


      {/* ========================================
          AI Header
      ======================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-slate-800/80
          bg-[#070d18]
          shadow-[0_25px_80px_rgba(0,0,0,0.24)]
        "
      >

        {/* Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-28
            h-80
            w-80
            rounded-full
            bg-cyan-400/[0.08]
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-100px]
            left-[35%]
            h-64
            w-64
            rounded-full
            bg-purple-500/[0.035]
            blur-[100px]
          "
        />


        {/* Grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />


        <div className="relative p-6 sm:p-8 lg:p-10">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            {/* Main Heading */}

            <div className="max-w-3xl">

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.06]
                  px-3
                  py-1.5
                "
              >

                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-cyan-400
                  "
                >
                  LexAI Intelligence
                </span>

              </div>


              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-[-0.03em]
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Your AI legal assistant.
                <span
                  className="
                    block
                    bg-gradient-to-r
                    from-white
                    via-slate-200
                    to-cyan-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  Ask. Analyze. Understand.
                </span>
              </h1>


              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-slate-500
                  sm:text-base
                "
              >
                Explore contracts, cases, compliance,
                legal risks, and research with your
                LexAI intelligence assistant.
              </p>

            </div>


            {/* AI Status */}

            <div className="w-full shrink-0 lg:w-[260px]">

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-950/70
                  p-5
                  backdrop-blur-xl
                "
              >

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    bg-cyan-400/[0.07]
                    blur-2xl
                  "
                />


                <div className="relative">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-cyan-400/15
                        bg-cyan-400/[0.07]
                      "
                    >

                      <Bot className="h-5 w-5 text-cyan-400" />

                    </div>


                    <div>

                      <p className="text-xs font-semibold text-white">
                        AI Assistant
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        LexAI intelligence engine
                      </p>

                    </div>

                  </div>


                  <div className="mt-4 flex items-center gap-2">

                    <span className="relative flex h-1.5 w-1.5">

                      <span
                        className="
                          absolute
                          inline-flex
                          h-full
                          w-full
                          animate-ping
                          rounded-full
                          bg-emerald-400
                          opacity-30
                        "
                      />

                      <span
                        className="
                          relative
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-emerald-400
                        "
                      />

                    </span>

                    <span className="text-[10px] text-emerald-400">
                      Ready to assist
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          Capability Cards
      ======================================== */}

      <section>

        <div className="mb-5">

          <div className="flex items-center gap-2">

            <div
              className="
                h-5
                w-1
                rounded-full
                bg-cyan-400
                shadow-[0_0_12px_rgba(34,211,238,0.6)]
              "
            />

            <h2 className="text-lg font-semibold tracking-tight text-white">
              Intelligence Capabilities
            </h2>

          </div>

          <p className="mt-1.5 text-sm text-slate-600">
            Use natural language to explore your legal workspace.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          {/* Legal Intelligence */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-800/80
              bg-[#080e19]
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-slate-700
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-cyan-400/[0.035]
                blur-3xl
                transition-all
                duration-300
                group-hover:bg-cyan-400/[0.06]
              "
            />

            <div className="relative">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.07]
                "
              >

                <ShieldCheck className="h-4 w-4 text-cyan-400" />

              </div>


              <h3 className="mt-5 text-sm font-semibold text-white">
                Legal Intelligence
              </h3>


              <p className="mt-2 text-xs leading-5 text-slate-600">
                Explore legal concepts, documents,
                cases, and research through AI.
              </p>


              <div className="mt-4 flex items-center gap-2">

                <span className="h-1 w-1 rounded-full bg-cyan-400" />

                <span className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
                  Intelligence
                </span>

              </div>

            </div>

          </div>


          {/* AI Analysis */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-800/80
              bg-[#080e19]
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-slate-700
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-purple-400/[0.035]
                blur-3xl
                transition-all
                duration-300
                group-hover:bg-purple-400/[0.06]
              "
            />

            <div className="relative">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-purple-400/15
                  bg-purple-400/[0.07]
                "
              >

                <Brain className="h-4 w-4 text-purple-400" />

              </div>


              <h3 className="mt-5 text-sm font-semibold text-white">
                AI Analysis
              </h3>


              <p className="mt-2 text-xs leading-5 text-slate-600">
                Ask focused questions and receive
                contextual legal analysis.
              </p>


              <div className="mt-4 flex items-center gap-2">

                <span className="h-1 w-1 rounded-full bg-purple-400" />

                <span className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
                  AI powered
                </span>

              </div>

            </div>

          </div>


          {/* Secure Processing */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-800/80
              bg-[#080e19]
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-slate-700
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-emerald-400/[0.035]
                blur-3xl
                transition-all
                duration-300
                group-hover:bg-emerald-400/[0.06]
              "
            />

            <div className="relative">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-400/15
                  bg-emerald-400/[0.07]
                "
              >

                <LockKeyhole className="h-4 w-4 text-emerald-400" />

              </div>


              <h3 className="mt-5 text-sm font-semibold text-white">
                Secure Processing
              </h3>


              <p className="mt-2 text-xs leading-5 text-slate-600">
                Your questions are processed through
                the LexAI application backend.
              </p>


              <div className="mt-4 flex items-center gap-2">

                <span className="h-1 w-1 rounded-full bg-emerald-400" />

                <span className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
                  Protected
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          Chat Workspace
      ======================================== */}

      <section>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <div
                className="
                  h-5
                  w-1
                  rounded-full
                  bg-cyan-400
                  shadow-[0_0_12px_rgba(34,211,238,0.6)]
                "
              />

              <h2 className="text-lg font-semibold tracking-tight text-white">
                AI Conversation
              </h2>

            </div>

            <p className="mt-1.5 text-sm text-slate-600">
              Ask LexAI about your legal questions.
            </p>

          </div>


          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-slate-800
              bg-slate-900/50
              px-3
              py-1.5
            "
          >

            <Zap className="h-3 w-3 text-cyan-500" />

            <span className="text-[9px] font-medium uppercase tracking-[0.13em] text-slate-600">
              AI Ready
            </span>

          </div>

        </div>


        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-800/80
            bg-[#080e19]
            shadow-[0_25px_70px_rgba(0,0,0,0.2)]
          "
        >

          {/* Chat glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-48
              w-72
              -translate-x-1/2
              rounded-full
              bg-cyan-400/[0.025]
              blur-3xl
            "
          />


          {/* =================================
              Chat Header
          ================================= */}

          <div
            className="
              relative
              flex
              items-center
              justify-between
              border-b
              border-slate-800/70
              bg-slate-950/30
              px-5
              py-4
              sm:px-6
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.07]
                "
              >

                <Bot className="h-4 w-4 text-cyan-400" />

              </div>


              <div>

                <p className="text-xs font-semibold text-slate-200">
                  LexAI Assistant
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[9px] text-slate-600">
                    Online
                  </span>

                </div>

              </div>

            </div>


            <div className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-slate-700 sm:flex">

              <ShieldCheck className="h-3 w-3" />

              Legal intelligence

            </div>

          </div>


          {/* =================================
              Chat Messages
          ================================= */}

          <div
            className="
              relative
              min-h-[450px]
              max-h-[600px]
              space-y-6
              overflow-y-auto
              p-5
              sm:p-6
              lg:p-8
            "
          >

            {messages.map(
              (message, index) => (

                <ChatMessage
                  key={index}
                  message={message.text}
                  sender={message.sender}
                />

              )
            )}


            {/* Loading Indicator */}

            {loading && (

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-cyan-400/10
                  bg-cyan-400/[0.025]
                  px-4
                  py-3
                  text-slate-500
                "
              >

                <div className="flex items-center gap-1">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

                  <span
                    className="
                      h-1.5
                      w-1.5
                      animate-pulse
                      rounded-full
                      bg-cyan-400
                    "
                    style={{
                      animationDelay: "150ms",
                    }}
                  />

                  <span
                    className="
                      h-1.5
                      w-1.5
                      animate-pulse
                      rounded-full
                      bg-cyan-400
                    "
                    style={{
                      animationDelay: "300ms",
                    }}
                  />

                </div>

                <span className="text-xs">
                  LexAI is processing your query...
                </span>

              </div>

            )}

          </div>


          {/* =================================
              Chat Input
          ================================= */}

          <div
            className="
              relative
              border-t
              border-slate-800/70
              bg-slate-950/30
              p-2
              sm:p-3
            "
          >

            <ChatInput
              onSend={handleSend}
            />

          </div>


          {/* =================================
              Footer
          ================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-slate-800/50
              px-5
              py-3
              sm:px-6
            "
          >

            <div className="flex items-center gap-2">

              <LockKeyhole className="h-3 w-3 text-slate-700" />

              <span className="text-[9px] text-slate-700">
                Processed through LexAI
              </span>

            </div>


            <span className="text-[9px] text-slate-800">
              {messages.length} messages
            </span>

          </div>

        </div>

      </section>


      {/* ========================================
          Bottom Status
      ======================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800/80
          bg-[#050a12]
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-28
            w-64
            -translate-x-1/2
            rounded-full
            bg-cyan-400/[0.04]
            blur-3xl
          "
        />


        <div
          className="
            relative
            flex
            flex-col
            gap-3
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:p-6
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-cyan-400/15
                bg-cyan-400/[0.06]
              "
            >

              <Sparkles className="h-4 w-4 text-cyan-400" />

            </div>


            <div>

              <p className="text-xs font-semibold text-slate-300">
                LexAI AI Legal Assistant
              </p>

              <p className="mt-0.5 text-[10px] text-slate-700">
                Ready to help you explore legal intelligence.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2">

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
                shadow-[0_0_8px_rgba(52,211,153,0.7)]
              "
            />

            <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-700">
              Assistant operational
            </span>

          </div>

        </div>

      </section>

    </div>

  );
}


export default ChatPage;