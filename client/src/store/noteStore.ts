import { create } from "zustand";
import { Note } from "../shared/types/note";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { noteService } from "../shared/services/noteService";
import { Source } from "../shared/types/source";

interface NoteStore {
  // Note List State
  notes: Note[];
  isNotesLoading: boolean;
  notesError: Error | null;
  
  // Single Note State
  currentNote: Note | null;
  isChatLoading: boolean;
  isActionLoading: boolean;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  
  // Note List Actions
  getNotes: () => Promise<void>;
  createNote: () => Promise<Note | undefined>;
  deleteNote: (id: string) => Promise<void>;
  renameNote: (id: string, title: string) => Promise<Note>;
  
  // Single Note Actions
  getNote: (id: string) => Promise<void>;
  addSource: (id: string, source: Partial<Source>) => Promise<void>,
  updateNote: (id: string, updates: Partial<Note>) => Promise<Note>;
  chatWithNote: (id: string, message: string) => Promise<void>;
  addChatMessage: (content: string, role: 'user' | 'assistant') => void;
  clearChat: () => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  // Initial state
  notes: [],
  isNotesLoading: false,
  isChatLoading: false,
  isActionLoading: false,
  notesError: null,
  currentNote: null,
  chatHistory: [],

  // Note List Actions
  getNotes: async () => {
    console.log('Fetching notes...');
    set({ isNotesLoading: true, notesError: null });
    try {
      const { notes } = await noteService.getNotes();
      console.log('Notes fetched successfully:', notes);
      set({ notes, isNotesLoading: false });
    } catch (error) {
      console.error('Error fetching notes:', error);
      const err = error as Error;
      set({ notesError: err, isNotesLoading: false });
      toast.error(err.message || 'Failed to fetch notes');
    }
  },

  createNote: async () => {
    set({ isActionLoading: true });
    try {
      const newNote = await noteService.createNote();
      set(state => ({
        notes: [newNote, ...state.notes],
        isActionLoading: false
      }));
      return newNote;
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to create note');
      set({ isActionLoading: false });
      return undefined;
    }
  },

  deleteNote: async (id: string) => {
    try {
      await noteService.deleteNote(id);
      set(state => ({
        notes: state.notes.filter(note => note._id !== id)
      }));
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to delete note');
      throw error;
    }
  },

  renameNote: async (id: string, title: string) => {
    try {
      const updatedNote = await noteService.updateNote(id, { title });
      
      set(state => ({
        notes: state.notes.map(note => 
          note._id === id ? { ...note, title } : note
        ),
        currentNote: state.currentNote?._id === id 
          ? { ...state.currentNote, title } 
          : state.currentNote
      }));
      
      return updatedNote;
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to rename note');
      throw error;
    }
  },

  // Single Note Actions
  getNote: async (id: string) => {
    set({ isActionLoading: true });
    try {
      const note = await noteService.getNote(id);
      set({ currentNote: note, isActionLoading: false });
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to fetch note');
      set({ isActionLoading: false });
      throw error;
    }
  },

  addSource: async (id: string, source: Partial<Source>) => {
    set({ isActionLoading: true });
    try {
      await noteService.addSource(id, source);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to add source');
    } finally {
      set({ isActionLoading: false });
    }
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await noteService.updateNote(id, updates);
      
      set(state => ({
        currentNote: state.currentNote?._id === id 
          ? { ...state.currentNote, ...updates } 
          : state.currentNote,
        notes: state.notes.map(note => 
          note._id === id ? { ...note, ...updates } : note
        )
      }));
      
      return updatedNote;
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to update note');
      throw error;
    }
  },

  chatWithNote: async (id: string, message: string) => {
    set({ isChatLoading: true });
    try {
      // Add user message immediately for better UX
      get().addChatMessage(message, 'user');
      
      // Get AI response
      const { response: aiResponse } = await noteService.chatWithNote(id, message);
      
      // Add AI response to chat history
      get().addChatMessage(aiResponse, 'assistant');
      
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || 'Failed to send message');
      throw error;
    } finally {
      set({ isChatLoading: false });
    }
  },

  addChatMessage: (content: string, role: 'user' | 'assistant') => {
    set(state => ({
      chatHistory: [...state.chatHistory, { role, content }]
    }));
  },

  clearChat: () => {
    set({ chatHistory: [] });
  },
}));
