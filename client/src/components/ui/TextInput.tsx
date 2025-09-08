import React, { useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-text-muted">{label}</label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            {...props}
            className={clsx(
              "w-full px-2 py-1 rounded-lg border border-neutral-300 bg-bg placeholder:text-neutral-400",
              "focus:outline-none focus:shadow-lg focus:shadow-primary-500/10 transition-[box-shadow,border-color] duration-300",
              error && "border-danger focus:ring-danger",
              isPassword && "pr-9", // make space for the icon
              className
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-neutral-500 hover:text-neutral-dark focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
