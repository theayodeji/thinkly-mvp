import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "../../shared/services/noteService";
import { Note } from "../../shared/types/note";
import { Source } from "../../shared/types/source";

export const NOTE_KEYS = {
  all: ["notes"] as const,
  lists: () => [...NOTE_KEYS.all, "list"] as const,
  details: () => [...NOTE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...NOTE_KEYS.details(), id] as const,
};

export const useNotes = (searchQuery: string = "") => {
  return useQuery({
    queryKey: NOTE_KEYS.lists(),
    queryFn: async () => {
      const response = await noteService.getNotes();
      return response.notes;
    },
    select: (notes) => {
      if (!searchQuery.trim()) return notes;
      
      const query = searchQuery.toLowerCase();
      return [...notes]
        .sort((a, b) => {
          const aMatchesTitle = a.title?.toLowerCase().includes(query) ?? false;
          const bMatchesTitle = b.title?.toLowerCase().includes(query) ?? false;
          if (aMatchesTitle && !bMatchesTitle) return -1;
          if (!aMatchesTitle && bMatchesTitle) return 1;
          return a.title?.toLowerCase().localeCompare(b.title?.toLowerCase() ?? "") ?? 1;
        })
        .filter(
          (note) =>
            note.title?.toLowerCase().includes(query) ||
            note.content?.toLowerCase().includes(query)
        );
    }
  });
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: NOTE_KEYS.detail(id),
    queryFn: () => noteService.getNote(id),
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noteService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.lists() });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Note> }) =>
      noteService.updateNote(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: NOTE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.lists() });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noteService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.lists() });
    },
  });
};

export const useAddSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, source }: { id: string; source: Partial<Source> }) =>
      noteService.addSource(id, source),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.detail(id) });
    },
  });
};

export const useDeleteSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceId }: { noteId: string; sourceId: string }) =>
      noteService.deleteSource(sourceId),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: NOTE_KEYS.detail(noteId) });
    },
  });
};

export const useChatWithNote = () => {
  return useMutation({
    mutationFn: ({
      noteId,
      message,
      history,
    }: {
      noteId: string;
      message: string;
      history: { role: "user" | "assistant"; content: string }[];
    }) => noteService.chatWithNote(noteId, message, history),
  });
};
