import { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message.trim());
    setMessage("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const hasMessage = message.trim().length > 0;

  return (
    <div className="border-t border-white/[0.06] bg-slate-950/80 p-4 sm:p-5">
      <div className="mx-auto max-w-5xl">
        <div
          className={`group relative flex items-center gap-3 rounded-2xl border p-2 transition-all duration-200 ${
            hasMessage
              ? "border-cyan-400/30 bg-slate-900/90 shadow-[0_0_35px_rgba(34,211,238,0.07)]"
              : "border-white/[0.08] bg-slate-900/70 hover:border-white/[0.12]"
          }`}
        >
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 sm:flex">
            <Sparkles size={17} />
          </div>

          <input
            type="text"
            placeholder="Ask your legal question..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-slate-500 sm:text-[15px]"
            aria-label="Ask your legal question"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!hasMessage}
            aria-label="Send message"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
              hasMessage
                ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 hover:shadow-cyan-400/30"
                : "cursor-not-allowed bg-slate-800 text-slate-600"
            }`}
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-[11px] text-slate-600">
            Press Enter to send
          </p>

          <p className="hidden text-[11px] text-slate-600 sm:block">
            LexAI may generate responses that require legal verification
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;