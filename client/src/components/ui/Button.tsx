import React from "react";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "neutral" | "ghost" | "dark";
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
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-300 outline-none focus:outline-none cursor-pointer";

  const variantStyles = {
    primary:
      `text-white hover:from-primary-400 hover:to-primary-500 focus:ring-primary-500 ${loading ? 'bg-neutral-400' : 'bg-gradient-to-br from-primary-500 to-primary-400 disabled:bg-neutral-400 disabled:cursor-not-allowed'} `,
    neutral:
      `bg-neutral-300 text-dark hover:bg-neutral-400 ${loading ? 'bg-neutral-300' : ''} disabled:bg-neutral-500`,
    ghost:
      `bg-transparent text-dark hover:bg-neutral/50 ${loading ? 'bg-neutral-100' : ''} ${disabled ? 'cursor-not-allowed' : ''} disabled:text-dark`,
    dark:
      `bg-dark text-white hover:bg-dark/80 focus:ring-border ${loading ? 'bg-neutral-700' : ''} disabled:text-white`,
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
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "disabled:cursor-not-allowed",
        className
      )}
    >
      {loading && (
        <LoaderCircle className="w-4 h-4 animate-spin" />
      )}
      {!loading && icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      {children && <span className="shrink-0">{children}</span>}
      {!loading && icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
