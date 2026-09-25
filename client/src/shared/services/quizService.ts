import { api } from "./api";
import { IQuiz, IQuizQuestion, QuizSchema, QuizQuestionSchema } from "@thinkly/shared";
import { z } from "zod";

export const quizService = {
  generateQuiz: async (SpaceId: string): Promise<{ quiz: IQuiz }> => {
    const response = await api.get<{ quiz: IQuiz }>(`/quiz/${SpaceId}/generate`);
    return { quiz: QuizSchema.parse(response.data.quiz) as unknown as IQuiz };
  },

  getQuiz: async (id: string): Promise<IQuiz> => {
    const response = await api.get(`/quiz/${id}`);
    return QuizSchema.parse(response.data) as unknown as IQuiz;
  },

  submitQuiz: async (
    id: string,
    answers: (number | null)[]
  ): Promise<{ score: number; answers: (IQuizQuestion | null)[] }> => {
    const response = await api.post(`/quiz/${id}/submit`, { answers });
    return {
      score: z.number().parse(response.data.score),
      answers: z.array(QuizQuestionSchema.nullable()).parse(response.data.answers) as (IQuizQuestion | null)[]
    };
  },
};
