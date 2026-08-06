import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInputProps {
  onSend: (message: string) => void;
}

function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  };

  return (
    <div className="flex items-center gap-4 border-t border-slate-800 p-6 bg-slate-900">
      <input
        type="text"
        placeholder="Ask your legal question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-white outline-none focus:border-cyan-400"
      />

      <button
        onClick={handleSend}
        className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-xl transition"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
}

export default ChatInput;