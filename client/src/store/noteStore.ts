import { create } from "zustand";
import { Note } from "../shared/types/note";
import { api, AxiosErrorWithResponse } from "../shared/services/api";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface NoteStore {
  notes: Note[];
  isNotesLoading: boolean;
  isChatLoading: boolean;
  isActionLoading: boolean;
  getNotes: () => void;
  createNote: () => void;
  deleteNote: (id: string) => void;
  renameNote: (id: string, title: string) => void;
  chatWithNote: (id: string, message: string) => void;
  chatHistoryWithNote: { assistant: string; user?: string }[];
  setChatHistoryWithNote: (message: string) => void;
  notesError: AxiosError<{ message: string }> | null;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  isNotesLoading: false,
  isChatLoading: false,
  isActionLoading: false,
  notesError: null,

  getNotes: async () => {
    set({isNotesLoading: true})
    try {
      const res = await api.get("/notes", {withCredentials: true});
      set({notes: res.data.notes, notesError: null})
    } catch (error) {
      set({notesError: error as AxiosErrorWithResponse});
      toast.error((error as AxiosErrorWithResponse)?.response?.data?.message ?? "Failed to fetch notes");
    } finally {
      set({isNotesLoading: false})
    }
  },

  createNote: async () => {
    set({isActionLoading: true});
    try {
      const {data} = await api.post("/notes/create");
      set({notes: [...get().notes, data.note], notesError: null});
      toast.success("Note created");
      window.location.href = `/notes/${data.note._id}`;
    } catch (error) {
      set({notesError: error as AxiosErrorWithResponse});
      toast.error((error as AxiosErrorWithResponse)?.response?.data?.message ?? "Failed to create note");
    } finally {
      set({isActionLoading: false});
    }
  },

  deleteNote: (id) =>
    set((state) => ({ notes: state.notes.filter((note) => note._id !== id) })),

  renameNote: (id, title) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note._id === id ? { ...note, title } : note
      ),
    })),
  chatWithNote: (id, message) =>{

  },

  chatHistoryWithNote: [],
  setChatHistoryWithNote: (message) =>
    set((state) => ({
      chatHistoryWithNote: [
        ...state.chatHistoryWithNote,
        { assistant: message },
      ],
    })),
}));
