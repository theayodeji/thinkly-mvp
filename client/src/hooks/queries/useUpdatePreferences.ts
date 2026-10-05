import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../shared/services/api";

interface UpdatePreferencesVariables {
  theme?: "light" | "dark" | "system";
  defaultVoice?: string;
  quizDifficulty?: "beginner" | "intermediate" | "advanced";
  emailReminders?: boolean;
}

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreferencesVariables) => {
      const response = await api.put("/users/preferences", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // We might also want to reload or fetch the user manually if it's not React Query based in this context,
      // but invalidating "user" as per instructions.
    },
  });
};
