import React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../shared/utils/cn";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "neutral" | "ghost" | "dark" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  type?: "button" | "submit" | "reset";
};

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  icon,
  iconPosition = "left",
  className,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center rounded-xl justify-center font-medium outline-none focus:outline-none cursor-pointer";

  const variantStyles = {
    primary: `${loading || disabled ? "bg-slate-300 dark:bg-slate-700 text-slate-500 disabled:cursor-not-allowed" : "btn-3d-primary"} `,
    neutral: `glass-panel text-text hover:bg-white/80 dark:hover:bg-slate-700/80 ${loading ? "opacity-70" : ""} disabled:opacity-50 disabled:cursor-not-allowed`,
    ghost: `bg-transparent text-text hover:bg-slate-100 dark:hover:bg-slate-800 ${loading ? "opacity-70" : ""} ${disabled ? "cursor-not-allowed opacity-50" : ""}`,
    dark: `bg-dark text-white hover:bg-dark/80 focus:ring-border ${loading ? "opacity-70" : ""} disabled:opacity-50`,
    outline: `border border-border bg-transparent text-text hover:bg-slate-50 dark:hover:bg-slate-800 ${loading ? "opacity-70" : ""} disabled:opacity-50 disabled:cursor-not-allowed`,
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-3",
    icon: "p-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "disabled:cursor-not-allowed",
        className,
      )}
    >
      {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === "left" && (
        <span className="shrink-0">{icon}</span>
      )}
      {children && <>{children}</>}
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
}
