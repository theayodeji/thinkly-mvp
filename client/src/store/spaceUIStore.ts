import { create } from "zustand";

interface SpaceUIState {
  isAddSourceModalOpen: boolean;
  setAddSourceModalOpen: (isOpen: boolean) => void;
  isSourceDrawerOpen: boolean;
  setSourceDrawerOpen: (isOpen: boolean) => void;
}

export const useSpaceUIStore = create<SpaceUIState>((set) => ({
  isAddSourceModalOpen: false,
  setAddSourceModalOpen: (isOpen) => set({ isAddSourceModalOpen: isOpen }),
  isSourceDrawerOpen: false,
  setSourceDrawerOpen: (isOpen) => set({ isSourceDrawerOpen: isOpen }),
}));
