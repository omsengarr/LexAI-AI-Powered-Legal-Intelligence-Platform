import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./dashboard/Sidebar";
import Topbar from "./dashboard/Topbar";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();
  const isChatPage = pathname === "/chat";

  return (
    <div
      className={`min-h-screen ${
        isChatPage
          ? "bg-white dark:bg-slate-950"
          : "bg-slate-950"
      }`}
    >
      {/* Existing website navigation — unchanged */}
      <Sidebar />

      {/* Main application area */}
      <div className="min-h-screen md:ml-72">
        {/* Existing topbar — unchanged */}
        <Topbar />

        {/* Page content */}
        <main
          className={
            isChatPage
              ? "min-h-[calc(100vh-5rem)] w-full bg-white dark:bg-slate-950"
              : "min-h-[calc(100vh-5rem)] bg-slate-950"
          }
        >
          <div
            className={
              isChatPage
                ? "min-h-[calc(100vh-5rem)] w-full max-w-none p-0"
                : "mx-auto w-full max-w-[1600px] px-6 py-8 sm:px-8 lg:px-10 xl:px-12"
            }
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;