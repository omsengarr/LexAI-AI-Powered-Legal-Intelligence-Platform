import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: string;
  sender: "user" | "ai";
}

function ChatMessage({
  message,
  sender,
}: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        sender === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-2xl px-5 py-4 rounded-2xl shadow-md ${
          sender === "user"
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        {sender === "ai" ? (
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white 
prose-li:text-slate-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
