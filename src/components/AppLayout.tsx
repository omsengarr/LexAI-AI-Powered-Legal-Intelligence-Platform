import type { ReactNode } from "react";

import Sidebar from "./dashboard/Sidebar";
import Topbar from "./dashboard/Topbar";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* ========================================
          Sidebar
      ======================================== */}

      <Sidebar />


      {/* ========================================
          Main Application Area
      ======================================== */}

      <div className="min-h-screen md:ml-72">

        {/* ========================================
            Topbar
        ======================================== */}

        <Topbar />


        {/* ========================================
            Page Content
        ======================================== */}

        <main
          className="
            min-h-[calc(100vh-5rem)]
            bg-slate-950
          "
        >

          {/* ========================================
              Consistent Content Container
          ======================================== */}

          <div
            className="
              w-full
              max-w-[1600px]
              mx-auto
              px-6
              py-8
              sm:px-8
              lg:px-10
              xl:px-12
            "
          >
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}

export default AppLayout;