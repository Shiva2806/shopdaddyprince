import { create } from "zustand";

interface AuthModalState {
  isOpen: boolean;
  redirectTo: string;
  open: (redirectTo?: string) => void;
  close: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  redirectTo: "",
  open: (redirectTo = "") => set({ isOpen: true, redirectTo }),
  close: () => set({ isOpen: false, redirectTo: "" }),
}));
