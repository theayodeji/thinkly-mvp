import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../shared/services/api";

export interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topicsCovered: string[];
}

export interface LearningPath {
  _id: string;
  id?: string;
  spaceId: string;
  topic: string;
  nodes: LearningPathNode[];
  createdAt: string;
  updatedAt: string;
}

export const useLearningPaths = (spaceId: string) => {
  return useQuery<LearningPath[]>({
    queryKey: ["spaces", spaceId, "learning-paths"],
    queryFn: async () => {
      const response = await api.get(`/spaces/${spaceId}/learning-paths`);
      return response.data;
    },
    enabled: !!spaceId,
  });
};

export const useGenerateLearningPath = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ spaceId, topic }: { spaceId: string; topic: string }) => {
      const response = await api.post(`/spaces/${spaceId}/learning-paths`, { topic });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["spaces", variables.spaceId, "learning-paths"],
      });
    },
  });
};
