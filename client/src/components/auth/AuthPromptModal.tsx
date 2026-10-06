import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Lock, Sparkles, UserPlus, LogIn } from "lucide-react";

export const AuthPromptModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState(
    "Sign in or create a free account to continue learning.",
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthPrompt = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.reason) {
        setReason(customEvent.detail.reason);
      }
      setIsOpen(true);
    };

    window.addEventListener("thinkly:auth-prompt-modal", handleAuthPrompt);
    return () => {
      window.removeEventListener("thinkly:auth-prompt-modal", handleAuthPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    setIsOpen(false);
    navigate("/auth/login");
  };

  const handleGoToRegister = () => {
    setIsOpen(false);
    navigate("/auth/register");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 bg-background border border-border rounded-3xl shadow-2xl text-center relative overflow-hidden">
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
