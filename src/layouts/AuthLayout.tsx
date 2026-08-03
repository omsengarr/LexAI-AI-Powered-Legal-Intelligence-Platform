import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">

        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        <p className="text-slate-400 mt-2 mb-8">
          {subtitle}
        </p>

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;