import { useState } from "react";

import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";

import { saveAIQuery } from "../../services/api";


interface Message {
  text: string;
  sender: "user" | "ai";
}


function ChatPage() {

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I am your AI Legal Assistant. How can I help you today?",
      sender: "ai",
    },
  ]);


  // ========================================
  // Handle User Message
  // ========================================

  const handleSend = async (
    message: string
  ) => {

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        sender: "user",
      },
    ]);


    // ========================================
    // Save Query to PostgreSQL
    // ========================================

    try {

      const result =
        await saveAIQuery(message);

      console.log(
        "AI query saved:",
        result
      );

    } catch (error) {

      console.error(
        "Failed to save AI query:",
        error
      );

    }


    // ========================================
    // Temporary AI Response
    // ========================================

    setMessages((prev) => [
      ...prev,
      {
        text: "This is a demo response. Later this will come from your FastAPI AI backend.",
        sender: "ai",
      },
    ]);
  };


  // ========================================
  // Chat UI
  // ========================================

  return (
    <div className="flex flex-col min-h-full">

      {/* ========================================
          Page Content
      ======================================== */}

      <main className="flex-1 p-8 overflow-y-auto">

        <h1 className="text-3xl font-bold text-white mb-8">
          AI Legal Assistant
        </h1>


        <div className="space-y-6">

          {messages.map(
            (message, index) => (

              <ChatMessage
                key={index}
                message={message.text}
                sender={message.sender}
              />

            )
          )}

        </div>

      </main>


      {/* ========================================
          Chat Input
      ======================================== */}

      <ChatInput
        onSend={handleSend}
      />

    </div>
  );
}


export default ChatPage;