import { api } from "./api";
import { Quiz, QuizQuestion } from "../types/quiz";
import { QuizSchema, QuizQuestionSchema } from "../schemas";
import { z } from "zod";

export const quizService = {
  generateQuiz: async (noteId: string): Promise<{ quiz: Quiz }> => {
    const response = await api.get<{ quiz: Quiz }>(`/quiz/${noteId}/generate`);
    return { quiz: QuizSchema.parse(response.data.quiz) as Quiz };
  },

  getQuiz: async (id: string): Promise<Quiz> => {
    const response = await api.get(`/quiz/${id}`);
    return QuizSchema.parse(response.data) as Quiz;
  },

  submitQuiz: async (
    id: string,
    answers: (number | null)[]
  ): Promise<{ score: number; answers: (QuizQuestion | null)[] }> => {
    const response = await api.post(`/quiz/${id}/submit`, { answers });
    return {
      score: z.number().parse(response.data.score),
      answers: z.array(QuizQuestionSchema.nullable()).parse(response.data.answers) as (QuizQuestion | null)[]
    };
  },
};
