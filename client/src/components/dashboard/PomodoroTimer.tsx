import React, { useEffect } from "react";
import { usePomodoro } from "../../contexts/PomodoroContext";
import toast from "react-hot-toast";

const PomodoroTimer: React.FC = () => {
  const {
    timeLeft,
    isActive,
    mode,
    cycles,
    toggleTimer,
    resetTimer,
    formatTime,
    progress,
  } = usePomodoro();

  // Effect to handle timer countdown
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      // The actual countdown is handled in the context
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Pomodoro Timer</h3>
      <div className="card p-6 text-center bg-bg/60 dark:bg-bg/60 rounded-md">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-neutral-300"
              strokeWidth="8"
              stroke="currentColor"
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary-500"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{formatTime(timeLeft)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {mode === "work" ? "Focus Time" : "Break Time"}
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={toggleTimer}
            className="px-6 py-2 bg-gradient-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {isActive ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Completed cycles: {cycles}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
