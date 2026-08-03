import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Input({ label, ...props }: InputProps) {
  return (
    <div className="mb-5">
      <label className="block text-slate-300 mb-2 font-medium">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
      />
    </div>
  );
}

export default Input;