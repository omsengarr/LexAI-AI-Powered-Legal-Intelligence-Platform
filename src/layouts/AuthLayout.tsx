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
    <div
      className="
        lexai-auth-page
        min-h-screen
        bg-slate-950
        text-white
        flex
        items-center
        justify-center
        px-4
        py-10
        relative
        overflow-hidden
      "
    >
      {/* ==================================================
          BACKGROUND DECORATION
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-32
          -left-32
          h-96
          w-96
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-purple-500/10
          blur-3xl
        "
      />

      {/* ==================================================
          MAIN AUTH CONTAINER
      ================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >
        {/* ==================================================
            AUTH CARD
        ================================================== */}

        <div
          className="
            lexai-auth-card
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
            shadow-2xl
            sm:p-8
          "
        >
          {/* ==================================================
              LOGO
          ================================================== */}

          <div className="mb-6 flex justify-center">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-xl
                bg-cyan-500
                text-2xl
                font-bold
                text-white
                shadow-lg
                shadow-cyan-500/20
              "
            >
              ⚖
            </div>
          </div>

          {/* ==================================================
              TITLE
          ================================================== */}

          <div className="mb-8 text-center">
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-white
                sm:text-3xl
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

          {/* ==================================================
              FORM CONTENT
          ================================================== */}

          {children}
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <p
          className="
            mt-6
            text-center
            text-xs
            text-slate-600
          "
        >
          LexAI • AI-Powered Legal Intelligence Platform
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;