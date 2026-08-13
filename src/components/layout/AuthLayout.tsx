import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

      {/* ========================================
          Background Decoration
      ======================================== */}

      <div
        className="
          fixed
          -top-32
          -left-32
          h-80
          w-80
          rounded-full
          bg-cyan-500/10
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          fixed
          -bottom-32
          -right-32
          h-80
          w-80
          rounded-full
          bg-purple-500/10
          blur-3xl
          pointer-events-none
        "
      />


      {/* ========================================
          Authentication Card
      ======================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            shadow-2xl
            p-6
            sm:p-8
          "
        >

          {/* ========================================
              Logo
          ======================================== */}

          <div className="flex justify-center mb-6">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-cyan-500
                text-white
                text-xl
                font-bold
                shadow-lg
                shadow-cyan-500/20
              "
            >
              ⚖
            </div>

          </div>


          {/* ========================================
              Title
          ======================================== */}

          <div className="text-center mb-8">

            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-white
              "
            >
              {title}
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              {subtitle}
            </p>

          </div>


          {/* ========================================
              Page Content
          ======================================== */}

          {children}

        </div>


        {/* ========================================
            Footer
        ======================================== */}

        <p className="mt-6 text-center text-xs text-slate-600">
          LexAI • AI-Powered Legal Intelligence Platform
        </p>

      </div>

    </div>
  );
}

export default AuthLayout;