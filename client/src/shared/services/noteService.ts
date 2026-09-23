import { api } from "./api";
import { Note } from "../types/note";
import { Source } from "../types/source";
import { NoteSchema, SourceSchema } from "../schemas";
import { z } from "zod";
import toast from "react-hot-toast";

export const noteService = {
  // Note collection operations
  getNotes: async (): Promise<{ notes: Note[] }> => {
    const response = await api.get<{ notes: Note[] }>("/notes");
    return { notes: z.array(NoteSchema).parse(response.data.notes) as Note[] };
  },

  createNote: async (): Promise<Note> => {
    const response = await api.post<{ note: Note }>("/notes/create");
    return NoteSchema.parse(response.data.note) as Note;
  },

  addSource: async (id: string, source: Partial<Source>): Promise<Source> => {
    try {
      const response = await api.post<{ source: Source }>(`/sources/add`, {
        noteId: id,
        ...source,
      });
      toast.success("Source added successfully");
      return SourceSchema.parse(response.data.source) as Source;
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || "Failed to add source";
      toast.error(message);
      throw error;
    }
  },

  deleteSource: async (id: string): Promise<void> => {
    await api.delete(`/sources/${id}`);
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/delete/${id}`);
  },

  // Single note operations
  getNote: async (id: string): Promise<Note> => {
    const response = await api.get<{ note: Note }>(`/notes/${id}`);
    return NoteSchema.parse(response.data.note) as Note;
  },

  updateNote: async (id: string, updates: Partial<Note>): Promise<Note> => {
    const response = await api.patch<{ note: Note }>(`/notes/${id}`, updates);
    return NoteSchema.parse(response.data.note) as Note;
  },

  chatWithNote: async (
    noteId: string,
    message: string,
    history: { role: "user" | "assistant"; content: string }[],
  ): Promise<{ response: string }> => {
    const response = await api.post<{ response: string }>(`/notes/chat`, {
      noteId,
      message,
      history,
    });
    return { response: z.string().parse(response.data.response) };
  },
};
