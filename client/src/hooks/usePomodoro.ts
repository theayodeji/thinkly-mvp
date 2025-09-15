import { usePomodoro as usePomodoroContext } from '../contexts/PomodoroContext';

export const usePomodoro = () => {
  return usePomodoroContext();
};

export type {  } from '../contexts/PomodoroContext';
