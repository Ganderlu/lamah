import { create } from "zustand";

export interface AuthUserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  gender: string;
  photoURL: string;
  role: string;
  status: string;
  rewardPoints: number;
  membershipLevel: string;
}

interface AuthStore {
  profile: AuthUserProfile | null;
  setProfile: (profile: AuthUserProfile) => void;
  clearProfile: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
