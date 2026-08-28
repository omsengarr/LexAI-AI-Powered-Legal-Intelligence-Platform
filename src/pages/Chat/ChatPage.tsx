import { useState } from "react";

import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";

import { sendChatMessage } from "../../services/api";

import {
  Bot,
  ShieldCheck,
  MessageSquare,
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

    <div className="min-h-full">

      {/* ================================== */}
      {/* Header */}
      {/* ================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          via-slate-900
          to-cyan-950/30
          p-6
          md:p-8
          mb-8
        "
      >

        <div
          className="
            absolute
            -right-20
            -top-20
            h-48
            w-48
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />


        <div
          className="
            relative
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-cyan-500/10
              border
              border-cyan-500/20
              text-cyan-400
            "
          >

            <Bot size={30} />

          </div>


          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-white
              "
            >
              AI Legal Assistant
            </h1>


            <p
              className="
                text-slate-400
                mt-1
              "
            >
              Ask questions and explore legal information
              with LexAI.
            </p>

          </div>

        </div>

      </section>


      {/* ================================== */}
      {/* Information Cards */}
      {/* ================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mb-8
        "
      >

        {/* ================================= */}
        {/* Legal Intelligence Card */}
        {/* ================================= */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <ShieldCheck
              size={22}
              className="text-cyan-400"
            />


            <div>

              <h3
                className="
                  text-white
                  font-semibold
                "
              >
                Legal Intelligence
              </h3>


              <p
                className="
                  text-slate-500
                  text-sm
                  mt-1
                "
              >
                Your queries are securely processed
                through the LexAI backend.
              </p>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* AI Assistant Card */}
        {/* ================================= */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <MessageSquare
              size={22}
              className="text-purple-400"
            />


            <div>

              <h3
                className="
                  text-white
                  font-semibold
                "
              >
                AI Assistant
              </h3>


              <p
                className="
                  text-slate-500
                  text-sm
                  mt-1
                "
              >
                Ask about contracts, cases, compliance
                and legal risks.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ================================== */}
      {/* Chat Area */}
      {/* ================================== */}

      <section
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
        "
      >

        {/* ================================= */}
        {/* Chat Messages */}
        {/* ================================= */}

        <div
          className="
            min-h-[450px]
            max-h-[600px]
            overflow-y-auto
            p-6
            space-y-6
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


          {/* ================================= */}
          {/* Loading Indicator */}
          {/* ================================= */}

          {loading && (

            <div
              className="
                flex
                items-center
                gap-3
                text-slate-400
              "
            >

              <div
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-cyan-400
                  animate-pulse
                "
              />

              <span className="text-sm">
                LexAI is processing your query...
              </span>

            </div>

          )}

        </div>


        {/* ================================= */}
        {/* Chat Input */}
        {/* ================================= */}

        <div
          className="
            border-t
            border-slate-800
          "
        >

          <ChatInput
            onSend={handleSend}
          />

        </div>

      </section>

    </div>

  );
}


export default ChatPage;