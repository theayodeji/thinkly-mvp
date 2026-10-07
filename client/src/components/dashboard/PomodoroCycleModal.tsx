import React, { useEffect } from "react";
import { X, Timer, Play, RotateCcw, Coffee } from "lucide-react";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { usePomodoro } from "../../contexts/PomodoroContext";

interface PomodoroCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PomodoroCycleModal: React.FC<PomodoroCycleModalProps> = ({ isOpen, onClose }) => {
  const { toggleTimer, resetTimer, switchMode, isActive, formatTime, timeLeft, mode } = usePomodoro();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleStartNewCycle = () => {
    switchMode("work");
    resetTimer();
    if (!isActive) {
      toggleTimer();
    }
    onClose();
  };

  const handleStartBreak = () => {
    switchMode("break");
    resetTimer();
    if (!isActive) {
      toggleTimer();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs min-h-[100dvh] w-screen"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-2xl relative border border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3.5 right-3.5 p-1.5 text-text-secondary hover:text-text hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-center">
              {/* Header Icon & Title */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-500 flex items-center justify-center shadow-inner">
                  <Timer className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text">Start a Pomodoro Cycle?</h3>
                  <p className="text-sm text-text-secondary mt-1 max-w-xs mx-auto">
                    Supercharge your productivity with a 25-minute study sprint followed by a 5-minute break.
                  </p>
                </div>
              </div>

              {/* Current Timer Status Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-text/10 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Current Session</p>
                  <p className="text-sm font-bold text-text capitalize">
                    {mode === "work" ? "Focus Session (25m)" : "Break Session (5m)"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary-500 font-mono">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleStartNewCycle}
                  className="w-full btn-3d-primary py-3 text-base font-bold flex items-center justify-center gap-2 rounded-xl"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start New 25m Cycle
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="neutral"
                    onClick={handleStartBreak}
                    className="glass-panel hover:bg-white/20 dark:hover:bg-slate-800/40 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 rounded-xl border border-text/10"
                  >
                    <Coffee className="w-4 h-4 text-emerald-500" />
                    5m Break
                  </Button>
                  <Button
                    variant="neutral"
                    onClick={onClose}
                    className="glass-panel hover:bg-white/20 dark:hover:bg-slate-800/40 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 rounded-xl border border-text/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PomodoroCycleModal;
