import { useState } from "react";

import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";

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

  const handleSend = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        sender: "user",
      },
      {
        text: "This is a demo response. Later this will come from your FastAPI backend.",
        sender: "ai",
      },
    ]);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            AI Legal Assistant
          </h1>

          <div className="space-y-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                sender={message.sender}
              />
            ))}
          </div>
        </div>

        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatPage;