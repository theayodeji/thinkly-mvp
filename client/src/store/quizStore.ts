import { create } from "zustand";
import { Quiz, QuizQuestion } from "../shared/types/quiz";
import { api } from "../shared/services/api";
import toast from "react-hot-toast";

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

  getQuiz: (id: string) => Promise<void>;
  startQuiz: () => void;
  submitAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => Promise<void>;
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

  /** Fetch quiz from backend */
  getQuiz: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await api.get(`/quiz/${id}`);
      set({ quiz: response.data as Quiz, isLoading: false });
    } catch (error) {
      toast.error("Failed to fetch quiz");
      console.error(error);
      set({ isLoading: false });
    }
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

  /** Submit entire quiz (manual or auto) */
  submitQuiz: async () => {
    const { quiz, answers } = get();
    if (!quiz) return;
    set({ isLoading: true });
    try {
      const response = await api.post(`/quiz/${quiz._id}/submit`, { answers });
      set({
        score: response.data.score,
        quizAnswers: response.data.answers,
        status: "completed",
      });
    } catch (error) {
      toast.error("Failed to submit quiz");
      console.error(error);
      set({ status: "completed" });
    } finally {
      set({ isLoading: false });
    }
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
    const { timeLeft, status, submitQuiz } = get();
    if (status !== "started") return;

    if (timeLeft <= 1) {
      // Auto submit when time runs out
      submitQuiz();
      return;
    }

    set({ timeLeft: timeLeft - 1 });
  },
}));
