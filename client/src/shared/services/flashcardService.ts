import { api } from "./api";
import { IFlashcard, FlashcardSchema } from "@thinkly/shared";
import { z } from "zod";

export const flashcardService = {
  generateFlashcards: async (SpaceId: string): Promise<{ flashcards: IFlashcard[] }> => {
    const response = await api.post(`/flashcards/${SpaceId}/generate`);
    return { flashcards: z.array(FlashcardSchema).parse(response.data.flashcards) as IFlashcard[] };
  },

  getFlashcards: async (SpaceId: string): Promise<{ flashcards: IFlashcard[] }> => {
    const response = await api.get(`/flashcards/${SpaceId}`);
    return { flashcards: z.array(FlashcardSchema).parse(response.data.flashcards) as IFlashcard[] };
  },

  deleteFlashcards: async (SpaceId: string): Promise<void> => {
    await api.delete(`/flashcards/${SpaceId}`);
  },
};
