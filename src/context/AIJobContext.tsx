import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8001";

const JOBS_STORAGE_KEY = "lexai_ai_jobs";
const NOTIFICATIONS_STORAGE_KEY = "lexai_ai_notifications";

export type AIJobType =
  | "chat"
  | "summary"
  | "risk"
  | "compliance"
  | "comparison"
  | "document_analysis";

export type AIJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "interrupted";

export interface AIJob<T = unknown> {
  id: string;
  historyId?: number;
  type: AIJobType;
  title: string;
  status: AIJobStatus;
  sourceRoute: string;
  documentId?: number;
  documentName?: string;
  query?: string;
  regulation?: string;
  startedAt: string;
  completedAt?: string;
  result?: T;
  error?: string;
  unread: boolean;
}

export interface AINotification {
  id: string;
  jobId: string;
  title: string;
  message: string;
  type: "success" | "error" | "info";
  createdAt: string;
  read: boolean;
  route: string;
}

interface StartAIJobOptions<T> {
  type: AIJobType;
  title: string;
  sourceRoute?: string;
  documentId?: number;
  documentName?: string;
  query?: string;
  regulation?: string;
  execute: () => Promise<T>;
}

interface AIJobContextValue {
  jobs: AIJob[];
  notifications: AINotification[];
  runningJobs: AIJob[];
  unreadNotifications: number;

  startAIJob: <T>(
    options: StartAIJobOptions<T>
  ) => Promise<string>;

  markJobRead: (jobId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  clearCompletedJobs: () => void;
}

const AIJobContext = createContext<AIJobContextValue | undefined>(
  undefined
);

function createJobId(type: AIJobType) {
  return `${type}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function createNotificationId() {
  return `notification-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function readStoredJobs(): AIJob[] {
  try {
    const stored = localStorage.getItem(JOBS_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStoredNotifications(): AINotification[] {
  try {
    const stored = localStorage.getItem(
      NOTIFICATIONS_STORAGE_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function createHistoryRecord(
  job: AIJob
): Promise<number | undefined> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ai-history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity_type: job.type,
          title: job.title,
          document_id: job.documentId ?? null,
          document_name: job.documentName ?? null,
          query: job.query ?? null,
          regulation: job.regulation ?? null,
          status: job.status,
        }),
      }
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();

    return data?.history?.id;
  } catch (error) {
    console.error(
      "Failed to create AI history record:",
      error
    );

    return undefined;
  }
}

async function updateHistoryRecord(
  historyId: number | undefined,
  job: AIJob
) {
  if (!historyId) {
    return;
  }

  try {
    await fetch(
      `${API_BASE_URL}/ai-history/${historyId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity_type: job.type,
          title: job.title,
          document_id: job.documentId ?? null,
          document_name: job.documentName ?? null,
          query: job.query ?? null,
          regulation: job.regulation ?? null,
          status: job.status,
          result:
            job.status === "completed"
              ? job.result ?? null
              : null,
          error:
            job.status === "failed"
              ? job.error ?? null
              : null,
        }),
      }
    );
  } catch (error) {
    console.error(
      "Failed to update AI history record:",
      error
    );
  }
}

export function AIJobProvider({
  children,
}: {
  children: ReactNode;
}) {
  const location = useLocation();

  const [jobs, setJobs] = useState<AIJob[]>(
    readStoredJobs
  );

  const [notifications, setNotifications] =
    useState<AINotification[]>(
      readStoredNotifications
    );

  useEffect(() => {
    localStorage.setItem(
      JOBS_STORAGE_KEY,
      JSON.stringify(jobs)
    );
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    /*
      If the browser was fully refreshed or reopened,
      JavaScript cannot continue an old in-memory fetch.
      Mark any previously running job as interrupted
      instead of falsely showing it as still running.

      Normal React route navigation does NOT trigger this
      because the provider remains mounted.
    */
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.status === "running" || job.status === "queued"
          ? {
              ...job,
              status: "interrupted",
              completedAt: new Date().toISOString(),
              error:
                "This AI task was interrupted because the browser session was restarted.",
            }
          : job
      )
    );
  }, []);

  const showCompletionNotification = useCallback(
    (
      job: AIJob,
      status: "completed" | "failed"
    ) => {
      const notification: AINotification = {
        id: createNotificationId(),
        jobId: job.id,
        title:
          status === "completed"
            ? `${job.title} completed`
            : `${job.title} failed`,
        message:
          status === "completed"
            ? job.documentName
              ? `${job.documentName} is ready.`
              : `${job.title} has finished successfully.`
            : job.error ||
              `${job.title} could not be completed.`,
        type:
          status === "completed"
            ? "success"
            : "error",
        createdAt: new Date().toISOString(),
        read: false,
        route: job.sourceRoute,
      };

      setNotifications((current) => [
        notification,
        ...current,
      ]);

      /*
        Browser notification is useful when the user is
        on another LexAI route or the browser tab is hidden.
      */
      const shouldShowBrowserNotification =
        document.visibilityState !== "visible" ||
        window.location.pathname !== job.sourceRoute;

      if (
        shouldShowBrowserNotification &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification(
            notification.title,
            {
              body: notification.message,
            }
          );
        } catch {
          // Ignore browser notification failures.
        }
      }
    },
    []
  );

  const startAIJob = useCallback(
    async <T,>(
      options: StartAIJobOptions<T>
    ): Promise<string> => {
      const jobId = createJobId(options.type);
      const startedAt = new Date().toISOString();

      const job: AIJob<T> = {
        id: jobId,
        type: options.type,
        title: options.title,
        status: "running",
        sourceRoute:
          options.sourceRoute ||
          location.pathname,
        documentId: options.documentId,
        documentName: options.documentName,
        query: options.query,
        regulation: options.regulation,
        startedAt,
        unread: true,
      };

      setJobs((current) => [job, ...current]);

      /*
        Save the history record immediately.
        The AI request itself starts immediately and is
        deliberately NOT tied to the current page component.
      */
      const historyId = await createHistoryRecord(job);

      if (historyId) {
        setJobs((current) =>
          current.map((currentJob) =>
            currentJob.id === jobId
              ? {
                  ...currentJob,
                  historyId,
                }
              : currentJob
          )
        );

        job.historyId = historyId;
      }

      try {
        const result = await options.execute();

        const completedJob: AIJob<T> = {
          ...job,
          historyId,
          status: "completed",
          completedAt: new Date().toISOString(),
          result,
          unread: true,
        };

        setJobs((current) =>
          current.map((currentJob) =>
            currentJob.id === jobId
              ? completedJob
              : currentJob
          )
        );

        await updateHistoryRecord(
          historyId,
          completedJob
        );

        showCompletionNotification(
          completedJob,
          "completed"
        );

        return jobId;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "The AI task failed.";

        const failedJob: AIJob = {
          ...job,
          historyId,
          status: "failed",
          completedAt: new Date().toISOString(),
          error: errorMessage,
          unread: true,
        };

        setJobs((current) =>
          current.map((currentJob) =>
            currentJob.id === jobId
              ? failedJob
              : currentJob
          )
        );

        await updateHistoryRecord(
          historyId,
          failedJob
        );

        showCompletionNotification(
          failedJob,
          "failed"
        );

        return jobId;
      }
    },
    [
      location.pathname,
      showCompletionNotification,
    ]
  );

  const markJobRead = useCallback(
    (jobId: string) => {
      setJobs((current) =>
        current.map((job) =>
          job.id === jobId
            ? {
                ...job,
                unread: false,
              }
            : job
        )
      );
    },
    []
  );

  const markNotificationRead = useCallback(
    (notificationId: string) => {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    },
    []
  );

  const markAllNotificationsRead =
    useCallback(() => {
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    }, []);

  const clearCompletedJobs = useCallback(() => {
    setJobs((current) =>
      current.filter(
        (job) =>
          job.status !== "completed" &&
          job.status !== "failed" &&
          job.status !== "interrupted"
      )
    );
  }, []);

  const runningJobs = useMemo(
    () =>
      jobs.filter(
        (job) =>
          job.status === "running" ||
          job.status === "queued"
      ),
    [jobs]
  );

  const unreadNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read
      ).length,
    [notifications]
  );

  const value = useMemo<AIJobContextValue>(
    () => ({
      jobs,
      notifications,
      runningJobs,
      unreadNotifications,
      startAIJob,
      markJobRead,
      markNotificationRead,
      markAllNotificationsRead,
      clearCompletedJobs,
    }),
    [
      jobs,
      notifications,
      runningJobs,
      unreadNotifications,
      startAIJob,
      markJobRead,
      markNotificationRead,
      markAllNotificationsRead,
      clearCompletedJobs,
    ]
  );

  return (
    <AIJobContext.Provider value={value}>
      {children}
    </AIJobContext.Provider>
  );
}

export function useAIJobs() {
  const context = useContext(AIJobContext);

  if (!context) {
    throw new Error(
      "useAIJobs must be used inside AIJobProvider."
    );
  }

  return context;
}