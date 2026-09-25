import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashcardService } from "../../shared/services/flashcardService";
import { SPACE_KEYS } from "./useSpaces";

export const FLASHCARD_KEYS = {
  all: ["flashcards"] as const,
  lists: () => [...FLASHCARD_KEYS.all, "list"] as const,
  list: (SpaceId: string) => [...FLASHCARD_KEYS.lists(), SpaceId] as const,
};

export const useFlashcards = (SpaceId: string) => {
  return useQuery({
    queryKey: FLASHCARD_KEYS.list(SpaceId),
    queryFn: async () => {
      const response = await flashcardService.getFlashcards(SpaceId);
      return response.flashcards;
    },
    enabled: !!SpaceId,
  });
};

export const useGenerateFlashcards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: flashcardService.generateFlashcards,
    onSuccess: (_, SpaceId) => {
      queryClient.invalidateQueries({ queryKey: FLASHCARD_KEYS.list(SpaceId) });
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.detail(SpaceId) });
    },
  });
};

export const useDeleteFlashcards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: flashcardService.deleteFlashcards,
    onSuccess: (_, SpaceId) => {
      queryClient.invalidateQueries({ queryKey: FLASHCARD_KEYS.list(SpaceId) });
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.detail(SpaceId) });
    },
  });
};
