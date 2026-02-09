import { api } from "./api";
import { Note } from "../types/note";
import { Source } from "../types/source";
import toast from "react-hot-toast";
import { Quiz } from "../types/quiz";

export const noteService = {
  // Note collection operations
  getNotes: async (): Promise<{ notes: Note[] }> => {
    const response = await api.get<{ notes: Note[] }>("/notes");
    return response.data;
  },

  createNote: async (): Promise<Note> => {
    const response = await api.post<{ note: Note }>("/notes/create");
    return response.data.note;
  },

  addSource: async (id: string, source: Partial<Source>): Promise<Source> => {
    const response = await api.post<{ source: Source }>(`/sources/add`, {
      noteId: id,
      ...source,
    });
    toast.success("Source added successfully");
    return response.data.source;
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
    return response.data.note;
  },

  updateNote: async (id: string, updates: Partial<Note>): Promise<Note> => {
    const response = await api.patch<{ note: Note }>(`/notes/${id}`, updates);
    return response.data.note;
  },

  chatWithNote: async (
    noteId: string,
    message: string,
    history: { role: "user" | "assistant"; content: string }[]
  ): Promise<{ response: string }> => {
    const response = await api.post<{ response: string }>(`/notes/chat`, {
      noteId,
      message,
      history,
    });
    return response.data;
  },

  generateQuiz: async (noteId: string): Promise<{ quiz: Quiz }> => {
    const response = await api.get<{ quiz: Quiz }>(`/quiz/${noteId}/generate`);
    return response.data;
  },

  // Flashcard operations
  generateFlashcards: async (noteId: string) => {
    const response = await api.post(`/flashcards/${noteId}/generate`);
    return response.data;
  },

  getFlashcards: async (noteId: string) => {
    const response = await api.get(`/flashcards/${noteId}`);
    return response.data;
  },

  deleteFlashcards: async (noteId: string) => {
    await api.delete(`/flashcards/${noteId}`);
  },
};
