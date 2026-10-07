import React, { useState, useEffect } from "react";
import { Sparkles, Clock, X, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";

export const BetaLimitModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState(
    "Thinkly Beta limit reached. Higher limits and unlimited plans are coming soon!",
  );

  useEffect(() => {
    const handleBetaLimitModal = (event: Event) => {
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

    window.addEventListener("thinkly:beta-limit-modal", handleBetaLimitModal);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("thinkly:beta-limit-modal", handleBetaLimitModal);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
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

        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-inner">
          <Sparkles className="w-7 h-7" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 mb-2">
          Thinkly Beta Preview
        </span>

        <h2 className="text-2xl font-black tracking-tight text-text-primary mb-2">
          Beta Limit Reached
        </h2>

        <p className="text-sm text-text-secondary mb-5 leading-relaxed font-medium">
          {reason}
        </p>

        <div className="p-4 mb-6 rounded-2xl bg-neutral-50 dark:bg-slate-800/60 border border-neutral-200/80 dark:border-slate-700/60 text-left space-y-2 text-xs text-text-secondary">
          <div className="flex items-center gap-2 text-text-primary font-semibold">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Limits Reset Daily</span>
          </div>
          <p className="pl-6 text-neutral-600 dark:text-neutral-400">
            During our public beta preview, daily limits reset every 24 hours to ensure high quality and platform performance for all testers.
          </p>
        </div>

        <Button
          onClick={handleClose}
          variant="primary"
          className="w-full py-3 font-bold flex items-center justify-center gap-2 shadow-md"
        >
          <CheckCircle2 className="w-4 h-4" />
          Got it, back to studying!
        </Button>
      </div>
    </div>
  );
};
