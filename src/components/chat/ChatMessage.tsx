import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  sender: "user" | "ai";
}

function ChatMessage({
  message,
  sender,
}: ChatMessageProps) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-3xl items-start gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            isUser
              ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
              : "border-white/[0.08] bg-slate-800/80 text-cyan-300"
          }`}
        >
          {isUser ? (
            <User size={16} />
          ) : (
            <Bot size={17} />
          )}
        </div>

        {/* Message */}
        <div
          className={`rounded-2xl border px-4 py-3.5 shadow-lg sm:px-5 sm:py-4 ${
            isUser
              ? "rounded-tr-md border-cyan-400/20 bg-cyan-400 text-slate-950 shadow-cyan-400/10"
              : "rounded-tl-md border-white/[0.07] bg-slate-900/90 text-slate-100 shadow-black/10"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-6">
              {message}
            </p>
          ) : (
            <div
              className="
                prose prose-invert max-w-none text-sm leading-7
                prose-headings:mb-3 prose-headings:mt-5 prose-headings:font-semibold prose-headings:text-white
                prose-h1:text-xl
                prose-h2:text-lg
                prose-h3:text-base
                prose-p:my-2 prose-p:text-slate-300
                prose-strong:text-white
                prose-em:text-slate-200
                prose-li:text-slate-300
                prose-ul:my-2
                prose-ol:my-2
                prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-cyan-400/30 prose-blockquote:text-slate-400
                prose-code:rounded-md prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-300
                prose-pre:rounded-xl prose-pre:border prose-pre:border-white/[0.06] prose-pre:bg-slate-950
                prose-table:overflow-hidden prose-table:rounded-xl
                prose-th:border prose-th:border-white/[0.07] prose-th:bg-slate-800 prose-th:px-3 prose-th:py-2 prose-th:text-white
                prose-td:border prose-td:border-white/[0.07] prose-td:px-3 prose-td:py-2 prose-td:text-slate-300
                prose-hr:border-white/[0.07]
              "
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;