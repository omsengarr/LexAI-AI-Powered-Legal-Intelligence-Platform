import type { ReactNode } from "react";

import Sidebar from "./dashboard/Sidebar";
import Topbar from "./dashboard/Topbar";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="min-h-screen md:ml-72">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)]">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;