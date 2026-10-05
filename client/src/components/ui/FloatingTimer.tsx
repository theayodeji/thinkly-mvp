import { useState } from "react";
import { Play, Pause, Square, X, Expand } from "lucide-react";
import { usePomodoro } from "../../hooks/usePomodoro";
import type { TimerMode } from "../../contexts/PomodoroContext";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import PomodoroTimer from "../dashboard/PomodoroTimer";

const FloatingTimer = () => {
  const { timeLeft, isActive, mode, toggleTimer, resetTimer, formatTime, progress, cycles } =
    usePomodoro();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const modeColors = {
    work: "bg-primary-500",
    break: "bg-emerald-500",
  };

  if (!isActive && timeLeft === 25 * 60 && !isFullscreen) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={clsx(
              "fixed bottom-6 right-6 z-40 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform",
              modeColors[mode as TimerMode]
            )}
            onClick={() => setIsFullscreen(true)}
          >
            <div className="flex flex-col items-center justify-center h-full text-white">
              <div className="text-xl font-bold tracking-tight leading-none">
                {formatTime(timeLeft)}
              </div>
              <div className="text-[10px] font-medium opacity-80 uppercase mt-1 tracking-widest">
                {mode}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-none"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10 dark:border-white/5">
              <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                Pomodoro Focus
              </h2>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-secondary hover:text-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="relative w-72 h-72 mx-auto mb-12">
                <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 100 100">
                  <circle
                    className="text-neutral-200 dark:text-neutral-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={clsx(
                      "transition-all duration-1000 ease-linear",
                      mode === "work" ? "text-primary-500" : "text-emerald-500"
                    )}
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="46"
                    cx="50"
                    cy="50"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-text">
                  <div className="text-6xl font-extrabold tracking-tighter tabular-nums drop-shadow-sm">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm font-bold text-text-secondary mt-2 uppercase tracking-widest">
                    {mode === "work" ? "Focus Session" : "Break Time"}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 justify-center w-full max-w-sm">
                <button
                  onClick={toggleTimer}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all active:scale-95",
                    mode === "work" 
                      ? "bg-gradient-to-br from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700" 
                      : "bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700"
                  )}
                >
                  {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                  {isActive ? "Pause" : "Start"}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-4 rounded-2xl font-bold text-text bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/40 shadow-sm transition-all active:scale-95 border border-white/20 dark:border-white/10"
                  aria-label="Reset"
                >
                  <Square className="w-6 h-6 fill-current" />
                </button>
              </div>
              
              <div className="mt-12 text-center">
                <div className="text-sm font-medium text-text-secondary uppercase tracking-widest">
                  Completed Cycles
                </div>
                <div className="text-3xl font-black text-text mt-2">
                  {cycles}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingTimer;
