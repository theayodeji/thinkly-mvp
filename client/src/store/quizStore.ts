import { create } from "zustand";
import { Quiz, QuizQuestion } from "../shared/types/quiz";

type QuizStatus = "idle" | "started" | "completed" | "review";

interface QuizState {
  quiz: Quiz | null;
  currentQuestion: number;
  answers: (number | null)[]; // null = unanswered
  timeLeft: number;
  status: QuizStatus;
  isLoading: boolean;
  score: number | null;
  quizAnswers: (QuizQuestion | null)[];
  setQuiz: (quiz: Quiz) => void;
  startQuiz: () => void;
  submitAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setQuizResult: (score: number, answers: (QuizQuestion | null)[]) => void;
  reviewAnswers: () => void;
  resetQuiz: () => void;
  tick: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quiz: null,
  currentQuestion: 0,
  answers: [],
  timeLeft: 0,
  status: "idle",
  isLoading: false,
  score: null,
  quizAnswers: [],
  /** Load quiz into state */
  setQuiz: (quiz: Quiz) => {
    set({ quiz, isLoading: false });
  },

  /** Start quiz (reset state, set timer, pre-fill answers) */
  startQuiz: () => {
    const { quiz } = get();
    if (!quiz) return;

    set({
      status: "started",
      timeLeft: 5 * 60, // 5 minutes in seconds
      currentQuestion: 0,
      answers: new Array(quiz.questions.length).fill(null), // pre-fill with nulls
      score: null,
    });
  },

  /** Record answer for current question */
  submitAnswer: (answerIndex) =>
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[state.currentQuestion] = answerIndex; // overwrite if changed
      return { answers: newAnswers };
    }),

  /** Move to next question */
  nextQuestion: () =>
    set((state) => {
      if (!state.quiz) return state;
      return {
        currentQuestion: Math.min(
          state.currentQuestion + 1,
          state.quiz.questions.length - 1
        ),
      };
    }),

  /** Move to previous question */
  prevQuestion: () =>
    set((state) => ({
      currentQuestion: Math.max(state.currentQuestion - 1, 0),
    })),
  /** Set results from API submission */
  setQuizResult: (score, answers) => {
    set({
      score,
      quizAnswers: answers,
      status: "completed",
    });
  },

  /** Review answers */
  reviewAnswers: () => {
    set({ status: "review" });
  },

  /** Reset quiz state */
  resetQuiz: () =>
    set({
      quiz: null,
      currentQuestion: 0,
      answers: [],
      status: "idle",
      timeLeft: 0,
      score: null,
    }),

  /** Tick timer every second */
  tick: () => {
    const { timeLeft, status } = get();
    if (status !== "started") return;

    if (timeLeft <= 0) {
      return;
    }

    set({ timeLeft: timeLeft - 1 });
  },
}));
