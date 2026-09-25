import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { spaceService } from "../../shared/services/spaceService";
import { ISpace, ISource } from "@thinkly/shared";

export const SPACE_KEYS = {
  all: ["spaces"] as const,
  lists: () => [...SPACE_KEYS.all, "list"] as const,
  details: () => [...SPACE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SPACE_KEYS.details(), id] as const,
  sources: (id: string) => [...SPACE_KEYS.detail(id), "sources"] as const,
};

export const useSpaceSources = (spaceId: string) => {
  return useQuery({
    queryKey: SPACE_KEYS.sources(spaceId),
    queryFn: () => spaceService.getSpaceSources(spaceId),
    enabled: !!spaceId,
  });
};

export const useSpaces = (searchQuery: string = "") => {
  return useQuery({
    queryKey: SPACE_KEYS.lists(),
    queryFn: async () => {
      const response = await spaceService.getSpaces();
      return response.spaces;
    },
    select: (spaces) => {
      if (!searchQuery.trim()) return spaces;
      
      const query = searchQuery.toLowerCase();
      return [...spaces]
        .sort((a, b) => {
          const aMatchesTitle = a.title?.toLowerCase().includes(query) ?? false;
          const bMatchesTitle = b.title?.toLowerCase().includes(query) ?? false;
          if (aMatchesTitle && !bMatchesTitle) return -1;
          if (!aMatchesTitle && bMatchesTitle) return 1;
          return a.title?.toLowerCase().localeCompare(b.title?.toLowerCase() ?? "") ?? 1;
        })
        .filter(
          (space) =>
            space.title?.toLowerCase().includes(query) ||
            space.content?.toLowerCase().includes(query)
        );
    }
  });
};

export const useSpace = (id: string) => {
  return useQuery({
    queryKey: SPACE_KEYS.detail(id),
    queryFn: () => spaceService.getSpace(id),
    enabled: !!id,
  });
};

export const useCreateSpace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: spaceService.createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.lists() });
    },
  });
};

export const useUpdateSpace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ISpace> }) =>
      spaceService.updateSpace(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SPACE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.lists() });
    },
  });
};

export const useDeleteSpace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: spaceService.deleteSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.lists() });
    },
  });
};

export const useAddSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, source }: { id: string; source: Partial<ISource> }) =>
      spaceService.addSource(id, source),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.sources(id) });
    },
  });
};

export const useDeleteSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceId }: { spaceId: string; sourceId: string }) =>
      spaceService.deleteSource(sourceId),
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: SPACE_KEYS.sources(spaceId) });
    },
  });
};

export const useChatHistory = (spaceId: string) => {
  return useInfiniteQuery({
    queryKey: SPACE_KEYS.detail(spaceId).concat(["chat"]),
    queryFn: ({ pageParam }) => spaceService.getChatHistory(spaceId, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!spaceId,
  });
};


