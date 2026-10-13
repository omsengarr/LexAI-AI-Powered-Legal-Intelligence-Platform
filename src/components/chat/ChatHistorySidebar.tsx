import {
  MessageSquare,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface ChatConversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: {
    text: string;
    sender: "user" | "ai";
  }[];
}

interface Props {
  conversations: ChatConversation[];
  activeId: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onDeleteChat: (id: string) => void;
}

function ChatHistorySidebar({
  conversations,
  activeId,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: Props) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [menuId, setMenuId] = useState("");

  const filtered = useMemo(
    () =>
      conversations.filter((chat) =>
        chat.title.toLowerCase().includes(search.toLowerCase())
      ),
    [conversations, search]
  );

  const groups = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const week = today - 7 * 24 * 60 * 60 * 1000;
    const month = today - 30 * 24 * 60 * 60 * 1000;

    return [
      { title: "Today", chats: filtered.filter((c) => c.updatedAt >= today) },
      { title: "This week", chats: filtered.filter((c) => c.updatedAt < today && c.updatedAt >= week) },
      { title: "This month", chats: filtered.filter((c) => c.updatedAt < week && c.updatedAt >= month) },
      { title: "Older", chats: filtered.filter((c) => c.updatedAt < month) },
    ];
  }, [filtered]);

  const startRename = (chat: ChatConversation) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
    setMenuId("");
  };

  const finishRename = () => {
    if (editTitle.trim() && editingId) {
      onRenameChat(editingId, editTitle.trim());
    }
    setEditingId("");
    setEditTitle("");
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b1220] md:w-72 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">LexAI Chat</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Legal workspace</p>
          </div>
        </div>
        <button
          onClick={() => setSearch("")}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          aria-label="Clear search"
          title="Clear search"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-3 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/10 transition hover:brightness-110"
        >
          <Plus size={17} /> New chat
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-white/10 dark:bg-white/[0.04]">
          <Search size={16} className="shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((group) =>
          group.chats.length ? (
            <section key={group.title} className="mb-5">
              <h3 className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.chats.map((chat) => (
                  <div key={chat.id} className="relative">
                    {editingId === chat.id ? (
                      <form
                        className="flex gap-1"
                        onSubmit={(e) => {
                          e.preventDefault();
                          finishRename();
                        }}
                      >
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setEditingId("");
                            }
                          }}
                          className="min-w-0 flex-1 rounded-lg border border-cyan-500 bg-white px-2 py-2 text-sm text-slate-900 outline-none dark:bg-slate-900 dark:text-white"
                          aria-label="Conversation title"
                        />
                        <button className="rounded-lg px-2 text-xs text-cyan-600" type="submit">
                          Save
                        </button>
                      </form>
                    ) : (
                      <>
                        <button
                          onClick={() => onSelectChat(chat.id)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setMenuId(menuId === chat.id ? "" : chat.id);
                          }}
                          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 pr-10 text-left text-sm transition ${
                            activeId === chat.id
                              ? "bg-cyan-50 font-medium text-cyan-800 ring-1 ring-cyan-200 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-400/15"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                          }`}
                        >
                          <MessageSquare size={15} className="shrink-0 opacity-70" />
                          <span className="min-w-0 flex-1 truncate">{chat.title}</span>
                        </button>

                        <button
                          onClick={() => setMenuId(menuId === chat.id ? "" : chat.id)}
                          aria-label={`Options for ${chat.title}`}
                          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {menuId === chat.id && (
                          <div className="absolute right-1 top-10 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                            <button
                              onClick={() => startRename(chat)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                              <Pencil size={14} /> Rename
                            </button>
                            <button
                              onClick={() => {
                                setMenuId("");
                                onDeleteChat(chat.id);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-400/10"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null
        )}

        {!filtered.length && (
          <p className="px-3 py-8 text-center text-sm text-slate-500">
            {search ? "No matching conversations" : "Your conversations will appear here"}
          </p>
        )}
      </div>

      <div className="border-t border-slate-200 p-3 dark:border-white/10">
        <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
          Conversations are saved in this browser
        </p>
      </div>
    </aside>
  );
}

export default ChatHistorySidebar;