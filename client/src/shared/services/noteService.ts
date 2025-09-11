import { api } from './api';
import { Note } from '../types/note';
import { Source } from '../types/source';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

type AxiosApiError = AxiosError<ApiErrorResponse>;

export const noteService = {
  // Note collection operations
  getNotes: async (): Promise<{ notes: Note[]}> => {
    try {
      const response = await api.get<{ notes: Note[] }>('/notes');
      return response.data;
    } catch (error) {
      const err = error as AxiosApiError;
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch notes');
    }
  },

  createNote: async (): Promise<Note> => {
    try {
      const response = await api.post<{ note: Note }>('/notes/create');
      return response.data.note;
    } catch (error) {
      const err = error as AxiosApiError;
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to create note');
    }
  },

  addSource: async (id: string, source: Partial<Source>): Promise<Source> => {
    try {
      const response = await api.post<{ source: Source }>(
        `/sources/add`, 
        { noteId: id, ...source }
      );
      toast.success('Source added successfully')
      return response.data.source;
    } catch (error) {
      const err = error as AxiosApiError;
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to add source');
    }
  },

  deleteNote: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notes/${id}`);
    } catch (error) {
      const err = error as AxiosApiError;
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to delete note');
    }
  },

  // Single note operations
  getNote: async (id: string): Promise<Note> => {
    try {
      const response = await api.get<{ note: Note }>(`/notes/${id}`);
      return response.data.note;
    } catch (error) {
      const err = error as AxiosApiError;
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch note');
    }
  },

  updateNote: async (id: string, updates: Partial<Note>): Promise<Note> => {
    try {
      const response = await api.patch<{ note: Note }>(
        `/notes/${id}`, 
        updates
      );
      return response.data.note;
    } catch (error) {
      const err = error as AxiosApiError;
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to update note');
    }
  },

  chatWithNote: async (noteId: string, message: string): Promise<{ response: string }> => {
    try {
      const response = await api.post<{ response: string }>(
        `/notes/${noteId}/chat`, 
        { message }
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosApiError;
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to get chat response');
    }
  },
};
