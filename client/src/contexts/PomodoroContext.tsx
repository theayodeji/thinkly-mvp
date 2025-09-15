import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

export type TimerMode = 'work' | 'break';

interface PomodoroContextType {
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  cycles: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (newMode: TimerMode) => void;
  formatTime: (seconds: number) => string;
  progress: number;
  WORK_DURATION: number;
  BREAK_DURATION: number;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const WORK_DURATION = 25 * 60; // 25 minutes in seconds
  const BREAK_DURATION = 5 * 60; // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState<number>(WORK_DURATION);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [cycles, setCycles] = useState<number>(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      const newMode = mode === 'work' ? 'break' : 'work';
      
      if (newMode === 'work') {
        setCycles((prev) => prev + 1);
        toast('Break time is over! Time to focus!', { icon: '🎯' });
      } else {
        toast('Take a break! You deserve it!', { icon: '☕' });
      }
      
      setMode(newMode);
      setTimeLeft(newMode === 'work' ? WORK_DURATION : BREAK_DURATION);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, WORK_DURATION, BREAK_DURATION]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? WORK_DURATION : BREAK_DURATION);
  }, [mode, WORK_DURATION, BREAK_DURATION]);

  const toggleTimer = useCallback(() => {
    if (isActive) {
      toast('Pomodoro timer paused', { icon: '⏸️', duration: 2000 });
    } else {
      toast('Pomodoro timer started', { icon: '▶️', duration: 2000 });
    }
    setIsActive(!isActive);
  }, [isActive]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_DURATION : BREAK_DURATION);
    setIsActive(false);
  }, [WORK_DURATION, BREAK_DURATION]);

  const progress = (timeLeft / (mode === 'work' ? WORK_DURATION : BREAK_DURATION)) * 100;

  return (
    <PomodoroContext.Provider
      value={{
        timeLeft,
        isActive,
        mode,
        cycles,
        toggleTimer,
        resetTimer,
        switchMode,
        formatTime,
        progress,
        WORK_DURATION,
        BREAK_DURATION,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = (): PomodoroContextType => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};
