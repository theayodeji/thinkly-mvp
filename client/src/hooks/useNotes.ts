import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "../shared/services/noteService";
import { Note } from "../shared/types/note";
import { Source } from "../shared/types/source";
import { toast } from "react-hot-toast";

type NoteId = string;

export const useNotes = () => {
  const queryClient = useQueryClient();

  // Get all notes
  const {
    data: notes = [],
    isLoading: isNotesLoading,
    error: notesError,
  } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: noteService.getNotes,
  });

  // Get a single note
  const getNote = (noteId: NoteId) => {
    return useQuery<Note>({
      queryKey: ["note", noteId],
      queryFn: () => noteService.getNote(noteId),
      enabled: !!noteId,
    });
  };

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: noteService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create note");
    },
  });

  // Update a note
  const updateNoteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Note> }) =>
      noteService.updateNote(id, updates),
    onSuccess: (updatedNote) => {
      queryClient.setQueryData(["note", updatedNote._id], updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update note");
    },
  });

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete note");
    },
  });

  // Add a source to a note
  const addSourceMutation = useMutation({
    mutationFn: ({ id, source }: { id: string; source: Partial<Source> }) =>
      noteService.addSource(id, source),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Source added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add source");
    },
  });

  return {
    // Queries
    notes,
    isNotesLoading,
    notesError,
    getNote,

    // Mutations
    createNote: createNoteMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    deleteNote: deleteNoteMutation.mutateAsync,
    addSource: addSourceMutation.mutateAsync,

    // Loading states
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isAddingSource: addSourceMutation.isPending,

    // Mutation states
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation,
    addSourceMutation,
  };
};

export default useNotes;
