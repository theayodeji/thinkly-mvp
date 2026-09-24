import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizService } from "../../shared/services/quizService";
import { NOTE_KEYS } from "./useNotes";

export const QUIZ_KEYS = {
  all: ["quiz"] as const,
  details: () => [...QUIZ_KEYS.all, "detail"] as const,
  detail: (id: string) => [...QUIZ_KEYS.details(), id] as const,
};

export const useQuiz = (id: string) => {
  return useQuery({
    queryKey: QUIZ_KEYS.detail(id),
    queryFn: () => quizService.getQuiz(id),
    enabled: !!id,
  });
};

export const useGenerateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: quizService.generateQuiz,
    onSuccess: (_, noteId) => {
      // Invalidate the note so it pulls the new quiz reference
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.detail(noteId) });
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, answers }: { id: string; answers: (number | null)[] }) =>
      quizService.submitQuiz(id, answers),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUIZ_KEYS.detail(id) });
    },
  });
};
