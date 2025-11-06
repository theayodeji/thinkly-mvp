import { create } from "zustand";

interface FlashcardStore {
  flashcards: Array<{ question: string; answer: string }>;
  currentIndex: number;
  isFlipped: boolean;
  flipCard: () => void;
  nextCard: () => void;
  prevCard: () => void;
  generateFlashcards: (noteId: string) => Promise<void>;
}

const useFlashcardStore = create<FlashcardStore>((set) => ({
  flashcards: [],
  currentIndex: 0,
  isFlipped: false,
  flipCard: () => {
    set((state) => ({ isFlipped: !state.isFlipped }));
  },
  nextCard: () => {
    set((state) => ({
      currentIndex: Math.min(
        state.currentIndex + 1,
        state.flashcards.length - 1
      ),
      isFlipped: false,
    }));
  },
  prevCard: () => {
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
      isFlipped: false,
    }));
  },
  generateFlashcards: async (noteId: string) => {
    noteId;
  },
}));

export default useFlashcardStore;
