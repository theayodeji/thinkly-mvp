import { api } from "./api";
import { Flashcard } from "../types/flashcard";
import { FlashcardSchema } from "../schemas";
import { z } from "zod";

export const flashcardService = {
  generateFlashcards: async (noteId: string): Promise<{ flashcards: Flashcard[] }> => {
    const response = await api.post(`/flashcards/${noteId}/generate`);
    return { flashcards: z.array(FlashcardSchema).parse(response.data.flashcards) as Flashcard[] };
  },

  getFlashcards: async (noteId: string): Promise<{ flashcards: Flashcard[] }> => {
    const response = await api.get(`/flashcards/${noteId}`);
    return { flashcards: z.array(FlashcardSchema).parse(response.data.flashcards) as Flashcard[] };
  },

  deleteFlashcards: async (noteId: string): Promise<void> => {
    await api.delete(`/flashcards/${noteId}`);
  },
};
