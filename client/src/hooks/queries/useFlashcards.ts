import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashcardService } from "../../shared/services/flashcardService";
import { NOTE_KEYS } from "./useNotes";

export const FLASHCARD_KEYS = {
  all: ["flashcards"] as const,
  lists: () => [...FLASHCARD_KEYS.all, "list"] as const,
  list: (noteId: string) => [...FLASHCARD_KEYS.lists(), noteId] as const,
};

export const useFlashcards = (noteId: string) => {
  return useQuery({
    queryKey: FLASHCARD_KEYS.list(noteId),
    queryFn: async () => {
      const response = await flashcardService.getFlashcards(noteId);
      return response.flashcards;
    },
    enabled: !!noteId,
  });
};

export const useGenerateFlashcards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: flashcardService.generateFlashcards,
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: FLASHCARD_KEYS.list(noteId) });
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.detail(noteId) });
    },
  });
};

export const useDeleteFlashcards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: flashcardService.deleteFlashcards,
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: FLASHCARD_KEYS.list(noteId) });
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.detail(noteId) });
    },
  });
};
