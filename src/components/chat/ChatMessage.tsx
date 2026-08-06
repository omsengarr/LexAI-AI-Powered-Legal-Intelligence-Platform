interface ChatMessageProps {
  message: string;
  sender: "user" | "ai";
}

function ChatMessage({ message, sender }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-2xl px-5 py-3 rounded-2xl shadow-md ${
          sender === "user"
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

export default ChatMessage;