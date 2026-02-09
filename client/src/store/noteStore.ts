import { create } from "zustand";
import { Note } from "../shared/types/note";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { noteService } from "../shared/services/noteService";
import { Source } from "../shared/types/source";
import { AxiosErrorWithResponse } from "../shared/services/api";
import { Flashcard } from "../shared/types/flashcard";

export interface NoteStore {
  // Note List State
  notes: Note[];
  isNotesLoading: boolean;
  notesError: Error | null;

  // Single Note State
  currentNote: Note | null;
  isChatLoading: boolean;
  isActionLoading: boolean;
  isQuizLoading: boolean;
  chatHistory: { role: "user" | "assistant"; content: string }[];

  // Note List Actions
  getNotes: () => Promise<void>;
  createNote: () => Promise<Note | undefined>;
  deleteNote: (id: string) => Promise<void>;
  renameNote: (id: string, title: string) => Promise<Note>;

  // Single Note Actions
  getNote: (id: string) => Promise<void>;
  addSource: (id: string, source: Partial<Source>) => Promise<Source>;
  deleteSource: (id: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<Note>;
  chatWithNote: (id: string, message: string) => Promise<void>;
  addChatMessage: (content: string, role: "user" | "assistant") => void;
  clearChat: () => void;

  // Quiz Actions
  generateQuiz: (id: string) => Promise<void>;

  // Flashcard State
  isFlashcardsLoading: boolean;
  flashcards: Flashcard[];

  // Flashcard Actions
  generateFlashcards: (noteId: string) => Promise<Flashcard[]>;
  getFlashcards: (noteId: string) => Promise<Flashcard[]>;
  deleteFlashcards: (noteId: string) => Promise<void>;
}

export const useNoteStore = create<NoteStore>()((set, get) => ({
  // Initial state
  notes: [],
  isNotesLoading: false,
  isChatLoading: false,
  isActionLoading: false,
  notesError: null,
  currentNote: null,
  chatHistory: [],
  isQuizLoading: false,
  isFlashcardsLoading: false,
  flashcards: [],

  // Note List Actions
  getNotes: async () => {
    set({ isNotesLoading: true, notesError: null });
    try {
      const { notes } = await noteService.getNotes();
      set({ notes, isNotesLoading: false });
    } catch (error) {
      console.error("Error fetching notes:", error);
      const err = error as AxiosError<AxiosErrorWithResponse>;
      set({ notesError: err, isNotesLoading: false });
      toast.error(err.response?.data.message || "Failed to fetch notes");
    }
  },

  createNote: async () => {
    set({ isActionLoading: true });
    try {
      const newNote = await noteService.createNote();
      set((state) => ({
        notes: [newNote, ...state.notes],
        isActionLoading: false,
      }));

      return newNote;
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(err.response?.data.message || "Failed to create note");
      set({ isActionLoading: false });
      return undefined;
    }
  },

  deleteNote: async (id: string) => {
    try {
      await noteService.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
      }));
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(err.response?.data.message || "Failed to delete note");
      throw error;
    }
  },

  renameNote: async (id: string, title: string) => {
    try {
      const updatedNote = await noteService.updateNote(id, { title });

      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === id ? { ...note, title } : note
        ),
        currentNote:
          state.currentNote?._id === id
            ? { ...state.currentNote, title }
            : state.currentNote,
      }));

      return updatedNote;
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(err.response?.data.message || "Failed to rename note");
      throw error;
    }
  },

  // Single Note Actions
  getNote: async (id: string) => {
    set({ isActionLoading: true, flashcards: [] }); // Clear flashcards when loading a new note
    try {
      const note = await noteService.getNote(id);
      set({ currentNote: note, isActionLoading: false });
      // Fetch flashcards for the new note
      if (note._id) {
        await get().getFlashcards(note._id);
      }
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(err.response?.data.message || "Failed to fetch note");
      set({ isActionLoading: false, flashcards: [] }); // Clear flashcards on error too
      throw error;
    }
  },

  addSource: async (id: string, source: Partial<Source>) => {
    set({ isActionLoading: true });
    try {
      const newSource = await noteService.addSource(id, source);

      await get().getNote(id);
      return newSource; // Return the new source for potential chaining
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(err.response?.data.message || "Failed to add source");
      throw error; // Re-throw to allow error handling in components
    } finally {
      set({ isActionLoading: false });
    }
  },

  deleteSource: async (id: string) => {
    try {
      await noteService.deleteSource(id);
      await get().getNote(id);
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(err.response?.data.message || "Failed to delete source");
      throw error;
    }
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await noteService.updateNote(id, updates);

      set((state) => ({
        currentNote:
          state.currentNote?._id === id
            ? { ...state.currentNote, ...updates }
            : state.currentNote,
        notes: state.notes.map((note) =>
          note._id === id ? { ...note, ...updates } : note
        ),
      }));

      return updatedNote;
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(err.response?.data.message || "Failed to update note");
      throw error;
    }
  },

  chatWithNote: async (id: string, message: string) => {
    set({ isChatLoading: true });
    try {
      get().addChatMessage(message, "user");
      const { response: aiResponse } = await noteService.chatWithNote(
        id,
        message,
        get().chatHistory
      );
      get().addChatMessage(aiResponse, "assistant");
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(
        err.response?.data.message || "Failed to send message, try again"
      );
      get().addChatMessage(
        "Oops, something went wrong, try asking that again.",
        "assistant"
      );
      throw error;
    } finally {
      set({ isChatLoading: false });
    }
  },

  addChatMessage: (content: string, role: "user" | "assistant") => {
    set((state) => ({
      chatHistory: [...state.chatHistory, { role, content }],
    }));
  },

  clearChat: () => {
    set({ chatHistory: [] });
  },

  generateQuiz: async (id: string) => {
    set({ isQuizLoading: true });
    toast.loading("Generating quiz...", { duration: 3000 });
    try {
      const { quiz } = await noteService.generateQuiz(id);
      toast.success("Quiz generated successfully");
      set((state) => {
        if (!state.currentNote) return {}; // Return empty update if no current note

        return {
          currentNote: {
            ...state.currentNote,
            quiz: quiz._id,
          },
        };
      });
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(err.response?.data.message || "Failed to generate quiz");
      throw error;
    } finally {
      set({ isQuizLoading: false });
    }
  },

  // Flashcard Actions
  generateFlashcards: async (noteId: string) => {
    set({ isFlashcardsLoading: true });
    toast.loading("Generating flashcards...", { duration: 2000 });
    try {
      const { flashcards } = await noteService.generateFlashcards(noteId);
      toast.success("Flashcards generated successfully");
      set((state) => ({
        currentNote: state.currentNote
          ? {
              ...state.currentNote,
              flashcards: flashcards.map((f: Flashcard) => f._id),
            }
          : null,
        flashcards,
      }));
      return flashcards;
    } catch (error) {
      const err = error as AxiosError<AxiosErrorWithResponse>;
      toast.error(
        err.response?.data?.message || "Failed to generate flashcards"
      );
      throw error;
    } finally {
      set({ isFlashcardsLoading: false });
    }
  },

  getFlashcards: async (noteId: string) => {
    set({ isFlashcardsLoading: true });
    try {
      const { flashcards } = await noteService.getFlashcards(noteId);
      set({ flashcards });
      return flashcards as Flashcard[];
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      toast.error("Failed to load flashcards");
      return [];
    } finally {
      set({ isFlashcardsLoading: false });
    }
  },

  deleteFlashcards: async (noteId: string) => {
    set({ isFlashcardsLoading: true });
    try {
      await noteService.deleteFlashcards(noteId);
      set((state) => ({
        currentNote: state.currentNote
          ? { ...state.currentNote, flashcards: [] }
          : null,
        flashcards: [],
      }));
      toast.success("Flashcards deleted successfully");
    } catch (error) {
      console.error("Error deleting flashcards:", error);
      toast.error("Failed to delete flashcards");
      throw error;
    } finally {
      set({ isFlashcardsLoading: false });
    }
  },
}));
