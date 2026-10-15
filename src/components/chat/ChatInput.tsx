import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Plus,
  Image,
  FileText,
  Video,
  X,
} from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const imageVideoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Close the attachment menu when clicking outside it.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length > 0) {
      setAttachments((previous) => {
        const existingKeys = new Set(
          previous.map(
            (file) => `${file.name}-${file.size}-${file.lastModified}`
          )
        );

        const newFiles = selectedFiles.filter(
          (file) =>
            !existingKeys.has(
              `${file.name}-${file.size}-${file.lastModified}`
            )
        );

        return [...previous, ...newFiles];
      });
    }

    // Allows selecting the same file again after removing it.
    event.target.value = "";
    setMenuOpen(false);
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  };

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    return FileText;
  };

  return (
    <div className="border-t border-white/[0.06] bg-slate-950/80 p-4 sm:p-5">
      <div className="mx-auto max-w-5xl">
        <div
          className={`group relative rounded-2xl border p-2 transition-all duration-200 ${
            hasMessage || attachments.length > 0
              ? "border-cyan-400/30 bg-slate-900/90 shadow-[0_0_35px_rgba(34,211,238,0.07)]"
              : "border-white/[0.08] bg-slate-900/70 hover:border-white/[0.12]"
          }`}
        >
          {/* Selected attachment list */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2 pt-2">
              {attachments.map((file, index) => {
                const FileIcon = getFileIcon(file);

                return (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex max-w-full items-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2"
                  >
                    <FileIcon
                      size={18}
                      className="shrink-0 text-cyan-300"
                    />

                    <div className="min-w-0">
                      <p className="max-w-[180px] truncate text-xs text-white">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      aria-label={`Remove ${file.name}`}
                      className="ml-1 rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Attachment button and popup */}
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Add attachments"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  menuOpen || attachments.length > 0
                    ? "bg-cyan-400/15 text-cyan-300"
                    : "bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
                }`}
              >
                {menuOpen ? <X size={19} /> : <Plus size={21} />}
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute bottom-14 left-0 z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl shadow-black/50"
                >
                  <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Add to your message
                  </p>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      imageVideoInputRef.current?.click()
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.07]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <Image size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">
                        Photos & Videos
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Upload images and video files
                      </p>
                    </div>
                    <Plus size={16} className="text-slate-500" />
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      documentInputRef.current?.click()
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.07]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                      <FileText size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">
                        Documents
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Upload PDF, Word, or text files
                      </p>
                    </div>
                    <Plus size={16} className="text-slate-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Hidden image and video picker */}
            <input
              ref={imageVideoInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              aria-label="Select photos and videos"
            />

            {/* Hidden document picker */}
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xls,.xlsx,.ppt,.pptx"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              aria-label="Select documents"
            />

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
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-[11px] text-slate-600">
            Press Enter to send
            {attachments.length > 0 &&
              ` · ${attachments.length} file(s) selected`}
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