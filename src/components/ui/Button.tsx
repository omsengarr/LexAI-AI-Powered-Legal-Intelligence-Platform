import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle =
  "px-8 py-4 rounded-xl font-semibold transition duration-300";

  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-cyan-500/40",

    secondary:
      "border border-slate-600 hover:border-cyan-400 bg-transparent text-white",
  };

  return (
    <button
      {...props}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;