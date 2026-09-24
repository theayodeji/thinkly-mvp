import React from "react";
import { usePomodoro } from "../../contexts/PomodoroContext";
import { Clock } from "lucide-react";
import { Button } from "../ui/Button";

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

  return (
    <div className="p-6 bg-bg border border-border/50 rounded-xl shadow-sm relative">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold">Pomodoro Timer</h3>
        <div className="relative">
          <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <div className="absolute -top-3 -right-8 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 100">
            <circle
              className="text-neutral-100 dark:text-neutral-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary-500 dark:text-primary-500 transition-all duration-1000 ease-linear"
              strokeWidth="10"
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
            <div className="text-4xl font-extrabold tracking-tight">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs font-bold text-text-secondary mt-1 uppercase tracking-widest">
              {mode === "work" ? "Focus Time" : "Break Time"}
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={toggleTimer}
            className="flex-1 bg-gradient-primary hover:bg-primary-700 text-white font-bold rounded-lg h-12"
          >
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button
            variant="outline"
            onClick={resetTimer}
            className="flex-1 font-bold rounded-lg h-12"
          >
            Reset
          </Button>
        </div>
        <div className="mt-6 text-sm font-medium text-text-secondary">
          Completed cycles:{" "}
          <span className="font-bold text-text">{cycles}</span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
