
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";
import { sendChatMessage } from "../../services/api";

import {
  Bot,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderPlus,
  FolderSearch,
  MessageCircle,
  MessageSquarePlus,
  MoreHorizontal,
  Pencil,
  Pin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "ai";
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  pinned: boolean;
  research: boolean;
  projectId?: string | null;
  updatedAt: number;
}

interface ResearchProject {
  id: string;
  name: string;
  createdAt: number;
}

const CHAT_STORAGE_KEY = "lexai-chat-conversations-v1";
const PROJECT_STORAGE_KEY = "lexai-research-projects-v1";

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const makeConversation = (): Conversation => ({
  id: makeId(),
  title: "New chat",
  messages: [
    {
      text: "Hello! I am your AI Legal Assistant. How can I help you today?",
      sender: "ai",
    },
  ],
  pinned: false,
  research: false,
  projectId: null,
  updatedAt: Date.now(),
});

function readSavedConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Conversation =>
        item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        Array.isArray(item.messages)
    );
  } catch {
    return [];
  }
}

function readSavedProjects(): ResearchProject[] {
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is ResearchProject =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.createdAt === "number"
    );
  } catch {
    return [];
  }
}

function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(
    () => readSavedConversations()
  );

  const [projects, setProjects] = useState<ResearchProject[]>(
    () => readSavedProjects()
  );

  const [activeConversationId, setActiveConversationId] = useState(
    () => readSavedConversations()[0]?.id ?? ""
  );

  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Independent collapse state for the AI chat history panel.
  const [historyCollapsed, setHistoryCollapsed] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (conversations.length === 0) {
      const starter = makeConversation();
      setConversations([starter]);
      setActiveConversationId(starter.id);
    } else if (
      !activeConversationId ||
      !conversations.some(
        (conversation) => conversation.id === activeConversationId
      )
    ) {
      setActiveConversationId(conversations[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error("Could not save LexAI conversations:", error);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("Could not save LexAI research projects:", error);
    }
  }, [projects]);

  // FIX: select an existing conversation and restore its project context.
  const selectConversation = (conversationId: string) => {
    const selectedConversation = conversations.find(
      (conversation) => conversation.id === conversationId
    );

    if (!selectedConversation) return;

    setActiveConversationId(conversationId);
    setActiveProjectId(selectedConversation.projectId ?? null);
    setOpenMenuId(null);
    setRenameId(null);
    setSearch("");
    setMobileSidebarOpen(false);
  };

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );

  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const updateConversation = (
    id: string,
    updater: (conversation: Conversation) => Conversation
  ) => {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id ? updater(conversation) : conversation
      )
    );
  };

  // FIX: when a project ID is provided, the new chat belongs to that project.
  const startNewChat = (projectId?: string | null) => {
    const conversation: Conversation = {
      id: makeId(),
      title: "New chat",
      messages: [
        {
          text: "Hello! I am your AI Legal Assistant. How can I help you today?",
          sender: "ai",
        },
      ],
      pinned: false,
      research: Boolean(projectId),
      projectId: projectId ?? null,
      updatedAt: Date.now(),
    };

    setConversations((previous) => [conversation, ...previous]);
    setActiveConversationId(conversation.id);
    setActiveProjectId(projectId ?? null);
    setSearch("");
    setOpenMenuId(null);
    setMobileSidebarOpen(false);
  };

  const createProject = () => {
    const name = window.prompt("Enter a name for your legal research project:");

    if (!name?.trim()) return;

    const project: ResearchProject = {
      id: makeId(),
      name: name.trim(),
      createdAt: Date.now(),
    };

    setProjects((previous) => [project, ...previous]);
    setActiveProjectId(project.id);

    setCollapsed((previous) => ({
      ...previous,
      researchProjects: false,
    }));
  };

  const renameProject = (project: ResearchProject) => {
    const name = window.prompt("Rename research project:", project.name);

    if (!name?.trim()) return;

    setProjects((previous) =>
      previous.map((item) =>
        item.id === project.id ? { ...item, name: name.trim() } : item
      )
    );
  };

  const deleteProject = (project: ResearchProject) => {
    const confirmed = window.confirm(
      `Delete "${project.name}"? Its chats will remain in your chat history.`
    );

    if (!confirmed) return;

    setProjects((previous) =>
      previous.filter((item) => item.id !== project.id)
    );

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.projectId === project.id
          ? { ...conversation, projectId: null }
          : conversation
      )
    );

    if (activeProjectId === project.id) {
      setActiveProjectId(null);
    }
  };

  const assignConversationToProject = (
    conversationId: string,
    projectId: string | null
  ) => {
    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      projectId,
      research: projectId ? true : conversation.research,
      updatedAt: Date.now(),
    }));

    setOpenMenuId(null);

    if (projectId) {
      setActiveProjectId(projectId);
    }
  };

  const handleSend = async (text: string) => {
    const userText = text.trim();

    if (!userText || loading || !activeConversation) return;

    const conversationId = activeConversation.id;
    const firstUserMessage = !activeConversation.messages.some(
      (message) => message.sender === "user"
    );

    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      title: firstUserMessage
        ? userText.length > 42
          ? `${userText.slice(0, 42).trim()}…`
          : userText
        : conversation.title,
      messages: [
        ...conversation.messages,
        { text: userText, sender: "user" },
      ],
      updatedAt: Date.now(),
    }));

    setLoading(true);

    try {
      const result = await sendChatMessage(userText);
      const answer =
        result?.response ||
        "I received your question, but no response was returned.";

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        messages: [
          ...conversation.messages,
          { text: answer, sender: "ai" },
        ],
        updatedAt: Date.now(),
      }));
    } catch (error) {
      console.error("Chat request failed:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sorry, I couldn't connect to the LexAI backend. Please make sure the backend server is running.";

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        messages: [
          ...conversation.messages,
          { text: errorMessage, sender: "ai" },
        ],
        updatedAt: Date.now(),
      }));
    } finally {
      setLoading(false);
    }
  };

  const togglePinned = (id: string) => {
    updateConversation(id, (conversation) => ({
      ...conversation,
      pinned: !conversation.pinned,
      updatedAt: Date.now(),
    }));

    setOpenMenuId(null);
  };

  const toggleResearch = (id: string) => {
    updateConversation(id, (conversation) => ({
      ...conversation,
      research: !conversation.research,
      updatedAt: Date.now(),
    }));

    setOpenMenuId(null);
  };

  const beginRename = (conversation: Conversation) => {
    setRenameId(conversation.id);
    setRenameValue(conversation.title);
    setOpenMenuId(null);
  };

  const saveRename = () => {
    if (!renameId || !renameValue.trim()) {
      setRenameId(null);
      return;
    }

    updateConversation(renameId, (conversation) => ({
      ...conversation,
      title: renameValue.trim(),
      updatedAt: Date.now(),
    }));

    setRenameId(null);
    setRenameValue("");
  };

  const deleteConversation = (id: string) => {
    const remaining = conversations.filter(
      (conversation) => conversation.id !== id
    );

    if (remaining.length === 0) {
      const fresh = makeConversation();
      setConversations([fresh]);
      setActiveConversationId(fresh.id);
      setActiveProjectId(null);
    } else {
      setConversations(remaining);

      if (activeConversationId === id) {
        const next = remaining[0];
        setActiveConversationId(next.id);
        setActiveProjectId(next.projectId ?? null);
      }
    }

    setOpenMenuId(null);
    setRenameId(null);
  };

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    const sorted = [...conversations].sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    const scoped = activeProjectId
      ? sorted.filter(
          (conversation) => conversation.projectId === activeProjectId
        )
      : sorted;

    if (!query) return scoped;

    return scoped.filter(
      (conversation) =>
        conversation.title.toLowerCase().includes(query) ||
        conversation.messages.some((message) =>
          message.text.toLowerCase().includes(query)
        )
    );
  }, [conversations, search, activeProjectId]);

  const pinned = filteredConversations.filter(
    (conversation) => conversation.pinned
  );

  const researches = filteredConversations.filter(
    (conversation) =>
      conversation.research &&
      !conversation.pinned &&
      !conversation.projectId
  );

  const recents = filteredConversations.filter(
    (conversation) =>
      !conversation.pinned &&
      !conversation.research &&
      !conversation.projectId
  );

  const toggleSection = (key: string) => {
    setCollapsed((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const renderConversation = (conversation: Conversation) => (
    <div key={conversation.id} className="group relative">
      {renameId === conversation.id ? (
        <form
          className="flex items-center gap-1 rounded-lg border border-blue-300 bg-white p-1 dark:border-blue-700 dark:bg-slate-900"
          onSubmit={(event) => {
            event.preventDefault();
            saveRename();
          }}
        >
          <input
            autoFocus
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setRenameId(null);
            }}
            className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-xs text-slate-800 outline-none dark:text-slate-100"
            aria-label="Conversation name"
          />

          <button type="submit" className="rounded p-1 text-blue-600" aria-label="Save name">
            <Check className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setRenameId(null)}
            className="rounded p-1 text-slate-500"
            aria-label="Cancel rename"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <>
          <button
            type="button"
            onClick={() => selectConversation(conversation.id)}
            title={conversation.title}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 pr-8 text-left text-[13px] transition ${
              activeConversationId === conversation.id
                ? "bg-blue-50 text-blue-800 dark:bg-slate-800 dark:text-blue-200"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
            }`}
          >
            <MessageCircle className="h-4 w-4 shrink-0 opacity-70" />
            <span className="min-w-0 flex-1 truncate">
              {conversation.title || "Untitled chat"}
            </span>
            {conversation.pinned && (
              <Pin className="h-3.5 w-3.5 shrink-0 text-blue-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setOpenMenuId(
                openMenuId === conversation.id ? null : conversation.id
              )
            }
            className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 opacity-0 transition hover:bg-slate-200 group-hover:opacity-100 focus:opacity-100 dark:hover:bg-slate-700 ${
              openMenuId === conversation.id ? "opacity-100" : ""
            }`}
            aria-label={`Options for ${conversation.title}`}
            aria-expanded={openMenuId === conversation.id}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {openMenuId === conversation.id && (
            <div className="absolute right-1 top-[calc(100%-2px)] z-30 max-h-[70vh] w-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => togglePinned(conversation.id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Pin className="h-4 w-4" />
                {conversation.pinned ? "Unpin chat" : "Pin chat"}
              </button>

              <button
                type="button"
                onClick={() => toggleResearch(conversation.id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FolderSearch className="h-4 w-4" />
                {conversation.research
                  ? "Remove from researches"
                  : "Add to researches"}
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Assign to project
              </p>

              <button
                type="button"
                onClick={() =>
                  assignConversationToProject(conversation.id, null)
                }
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
                No project
                {!conversation.projectId && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </button>

              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() =>
                    assignConversationToProject(conversation.id, project.id)
                  }
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Folder className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">
                    {project.name}
                  </span>
                  {conversation.projectId === project.id && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </button>
              ))}

              {projects.length === 0 && (
                <p className="px-3 py-2 text-xs text-slate-400">
                  Create a project first.
                </p>
              )}

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                type="button"
                onClick={() => beginRename(conversation)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />
                Rename
              </button>

              <button
                type="button"
                onClick={() => deleteConversation(conversation.id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderSection = (
    key: string,
    title: string,
    icon: ReactNode,
    items: Conversation[]
  ) => (
    <section className="mb-2" key={key}>
      <button
        type="button"
        onClick={() => toggleSection(key)}
        className="mb-1 flex w-full items-center gap-2 px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        {icon}
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${
            collapsed[key] ? "-rotate-90" : ""
          }`}
        />
      </button>

      {!collapsed[key] && (
        <div className="space-y-0.5">
          {items.length ? (
            items.map(renderConversation)
          ) : (
            <p className="px-2.5 py-1.5 text-xs leading-5 text-slate-400">
              {search
                ? "No matches."
                : title === "Pinned"
                  ? "Pinned chats will appear here."
                  : "Your recent chats will appear here."}
            </p>
          )}
        </div>
      )}
    </section>
  );

  const renderSidebar = () => (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 dark:border-slate-800 dark:bg-slate-950 ${
        historyCollapsed ? "w-12" : "w-[240px]"
      }`}
    >
      {historyCollapsed ? (
        <div className="flex flex-col items-center gap-3 p-2">
          <button
            type="button"
            onClick={() => setHistoryCollapsed(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Expand chat history"
            title="Expand chat history"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setHistoryCollapsed(false);
              startNewChat();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-900"
            aria-label="New chat"
            title="New chat"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
      <div className="p-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => startNewChat()}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            <MessageSquarePlus className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">New Chat</span>
            <Plus className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => setHistoryCollapsed(true)}
            className="flex h-9 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Collapse chat history"
            title="Collapse chat history"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-2 flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-2 dark:bg-slate-900">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats"
            aria-label="Search conversations"
            className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5 text-slate-500" />
            </button>
          )}
        </label>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {/* Research projects remain inside the RESEARCHES section. */}
        <section className="mb-2">
          <div className="mb-1 flex w-full items-center gap-2 px-2 py-1.5">
            <FolderSearch className="h-3.5 w-3.5 shrink-0 text-slate-500" />

            <button
              type="button"
              onClick={() => toggleSection("researchProjects")}
              className="flex flex-1 items-center gap-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              <span className="flex-1">Researches</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  collapsed.researchProjects ? "-rotate-90" : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={createProject}
              className="rounded-md p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-800"
              aria-label="Create research project"
              title="Create research project"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          </div>

          {!collapsed.researchProjects && (
            <div className="space-y-0.5">
              {projects.map((project) => {
                const projectChats = conversations
                  .filter(
                    (conversation) => conversation.projectId === project.id
                  )
                  .sort((a, b) => b.updatedAt - a.updatedAt);

                const isActive = activeProjectId === project.id;

                return (
                  <div key={project.id} className="group/project">
                    <div
                      className={`flex items-center rounded-lg ${
                        isActive
                          ? "bg-slate-800 text-blue-200"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProjectId(isActive ? null : project.id);
                          setSearch("");
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-xs"
                        title={project.name}
                      >
                        <Folder className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 flex-1 truncate">
                          {project.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {projectChats.length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const action = window.prompt(
                            `Manage "${project.name}": enter R to rename or D to delete.`,
                            "R"
                          );

                          if (action?.trim().toLowerCase() === "r") {
                            renameProject(project);
                          } else if (action?.trim().toLowerCase() === "d") {
                            deleteProject(project);
                          }
                        }}
                        className="mr-1 rounded p-1 text-slate-500 opacity-0 hover:bg-slate-200 group-hover/project:opacity-100 focus:opacity-100 dark:hover:bg-slate-700"
                        aria-label={`Manage project ${project.name}`}
                        title="Manage project"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {isActive && (
                      <div className="ml-4 mt-1 border-l border-slate-200 pl-2 dark:border-slate-700">
                        {projectChats.map((conversation) => (
                          <button
                            key={conversation.id}
                            type="button"
                            onClick={() =>
                              selectConversation(conversation.id)
                            }
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs ${
                              activeConversationId === conversation.id
                                ? "bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            }`}
                            title={conversation.title}
                          >
                            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {conversation.title}
                            </span>
                          </button>
                        ))}

                        {projectChats.length === 0 && (
                          <p className="px-2 py-2 text-xs text-slate-400">
                            No chats in this project yet.
                          </p>
                        )}

                        {/* FIX: pass project.id so this chat belongs to this project. */}
                        <button
                          type="button"
                          onClick={() => startNewChat(project.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs text-blue-600 hover:bg-slate-100 dark:text-blue-400 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          New chat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {projects.length === 0 && (
                <p className="px-2 py-2 text-xs leading-5 text-slate-400">
                  Create a research project with the + button.
                </p>
              )}

              {researches.length > 0 && (
                <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                  <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Saved research chats
                  </p>
                  {researches.map(renderConversation)}
                </div>
              )}
            </div>
          )}
        </section>

        {renderSection(
          "pinned",
          "Pinned",
          <Pin className="h-3.5 w-3.5" />,
          pinned
        )}

        {renderSection(
          "recents",
          "Recents",
          <MessageCircle className="h-3.5 w-3.5" />,
          recents
        )}
      </div>

      <div className="border-t border-slate-200 px-2 py-2 dark:border-slate-800">
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span className="truncate">LexAI Legal Assistant</span>
        </div>
      </div>
        </>
      )}
    </aside>
  );

  return (
    <div className="relative flex h-[calc(100dvh-5rem)] min-h-[520px] w-full min-w-0 overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="hidden md:flex">{renderSidebar()}</div>

      {mobileSidebarOpen && (
        <div className="absolute inset-0 z-40 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close chat history"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 h-full shadow-xl">
            {renderSidebar()}
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col bg-white dark:bg-slate-950">
        <header className="flex min-h-[60px] items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5 sm:px-5 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
              aria-label="Open chat history"
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Bot className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                AI Legal Assistant
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                {activeProjectId
                  ? `Project: ${
                      projects.find(
                        (project) => project.id === activeProjectId
                      )?.name ?? "Research"
                    }`
                  : "Ask questions and explore legal insights."}
              </p>
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Online
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {messages.length <= 1 ? (
            <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col justify-center px-4 py-8 sm:px-8 sm:py-10">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Sparkles className="h-7 w-7" />
              </div>

              <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                How can I help you today?
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                Ask LexAI to explain legal concepts, review a clause, identify
                risks, or help you explore a legal question.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  [
                    "Explain a legal concept",
                    "Explain a legal concept in simple language.",
                  ],
                  [
                    "Identify contract risks",
                    "What risks should I look for in a contract?",
                  ],
                  [
                    "Understand compliance",
                    "Explain the key steps in a compliance review.",
                  ],
                  [
                    "Explore case law",
                    "How should I approach legal case-law research for my question?",
                  ],
                ].map(([label, prompt]) => (
                  <button
                    key={label}
                    type="button"
                    disabled={loading}
                    onClick={() => void handleSend(prompt)}
                    className="rounded-xl border border-slate-200 p-3.5 text-left text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/60 disabled:opacity-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:bg-slate-900"
                  >
                    <span className="font-medium">{label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
              {messages.map((message, index) => (
                <ChatMessage
                  key={`${activeConversationId}-${index}`}
                  message={message.text}
                  sender={message.sender}
                />
              ))}

              {loading && (
                <div
                  className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400"
                  role="status"
                  aria-live="polite"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Bot className="h-4 w-4" />
                  </span>
                  LexAI is preparing your response…
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <footer className="border-t border-slate-200 bg-white px-3 pb-3 pt-3 sm:px-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-blue-800 dark:focus-within:ring-blue-950">
              <ChatInput onSend={handleSend} />
            </div>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              LexAI can make mistakes. Verify important legal information
              against authoritative sources.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default ChatPage;
