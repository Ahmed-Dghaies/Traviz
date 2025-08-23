import { create } from "zustand";

interface TripsUIState {
  currentUserId: string | null;
  plan: { tier: "free" | "premium"; tripLimit?: number };
  setCurrentUser: (userId: string | null) => void;
  exportShareLink: (tripId: string) => string;
}

export const useTripsUIStore = create<TripsUIState>((set) => ({
  currentUserId: null,
  plan: { tier: "free", tripLimit: 3 },

  setCurrentUser: (userId) => {
    set({ currentUserId: userId });
  },

  exportShareLink: (tripId: string) => {
    return `${window.location.origin}/import?data=${encodeURIComponent(
      JSON.stringify({ tripId })
    )}`;
  },
}));
