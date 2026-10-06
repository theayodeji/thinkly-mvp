import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Lock, Sparkles, UserPlus, LogIn, X } from "lucide-react";

export const AuthPromptModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("Sign in or create a free account to continue learning.");
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthPrompt = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.reason) {
        setReason(customEvent.detail.reason);
      }
      setIsOpen(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("thinkly:auth-prompt-modal", handleAuthPrompt);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("thinkly:auth-prompt-modal", handleAuthPrompt);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleGoToLogin = () => {
    setIsOpen(false);
    navigate("/auth/login");
  };

  const handleGoToRegister = () => {
    setIsOpen(false);
    navigate("/auth/register");
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 animate-fade-in transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-6 sm:p-8 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-3xl shadow-2xl text-center relative overflow-hidden"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 mb-2">
          Guest Trial Limit Reached
        </span>

        <h2 className="text-2xl font-black tracking-tight text-text-primary mb-2">
          Unlock Full Access
        </h2>

        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          {reason}
        </p>

        <div className="space-y-3">
          <Button
            onClick={handleGoToRegister}
            variant="primary"
            className="w-full py-3 font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            Create Free Account
          </Button>

          <Button
            onClick={handleGoToLogin}
            variant="outline"
            className="w-full py-3 font-semibold flex items-center justify-center gap-2 border-border"
          >
            <LogIn className="w-4 h-4" />
            Already have an account? Sign In
          </Button>
        </div>

        <p className="text-[11px] text-text-secondary mt-6 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" />
          Free forever for essential study tools. No credit card required.
        </p>
      </div>
    </div>
  );
};
