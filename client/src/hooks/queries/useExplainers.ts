import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { explainerService } from "../../shared/services/explainerService";
import { useEventListener } from "../useEventStream";

export const useExplainers = (spaceId: string) => {
  const queryClient = useQueryClient();

  useEventListener("explainer:updated", (data: { spaceId: string; explainerId: string; status: string }) => {
    if (!spaceId || data.spaceId === spaceId) {
      queryClient.invalidateQueries({ queryKey: ["explainers", spaceId] });
    }
  });

  return useQuery({
    queryKey: ["explainers", spaceId],
    queryFn: () => explainerService.getBySpaceId(spaceId),
    enabled: !!spaceId,
  });
};

export const useGenerateExplainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, concept, voiceId }: { spaceId: string; concept: string; voiceId?: string }) =>
      explainerService.generate(spaceId, concept, voiceId),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: ["explainers", spaceId] });
    },
  });
};

export const useDeleteExplainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => explainerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["explainers"] });
    },
  });
};

export const useRetryExplainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => explainerService.retryExplainer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["explainers"] });
    },
  });
};
