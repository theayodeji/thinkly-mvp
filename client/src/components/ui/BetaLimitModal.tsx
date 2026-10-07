import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

export const BetaLimitModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState(
    "Thinkly Beta limit reached. Higher limits and unlimited plans are coming soon!"
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

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-[50%] top-[50%] z-[101] w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Limit Reached
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {reason}
                </p>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-2">
                <Button
                  onClick={handleClose}
                  variant="primary"
                  className="w-full py-2.5 font-semibold text-sm justify-center rounded-xl"
                >
                  Got it
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
