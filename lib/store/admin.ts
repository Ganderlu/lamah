import { create } from "zustand";

const DIRECTOR_CODE_KEY = "lamah_admin_director_verified";
const DIRECTOR_CODE_TS_KEY = "lamah_admin_director_verified_at";

export const DIRECTOR_SIGNUP_CODE = "LAMAH-DIRECTOR-2026";

interface AdminAuthStore {
  directorVerified: boolean;
  setDirectorVerified: (verified: boolean) => void;
  clearDirectorVerified: () => void;
  isDirectorCodeValid: (code: string) => boolean;
}

export const useAdminStore = create<AdminAuthStore>((set) => ({
  directorVerified:
    typeof window !== "undefined" &&
    localStorage.getItem(DIRECTOR_CODE_KEY) === "true" &&
    (() => {
      const ts = localStorage.getItem(DIRECTOR_CODE_TS_KEY);
      if (!ts) return false;
      const age = Date.now() - parseInt(ts, 10);
      return age < 1000 * 60 * 30;
    })(),

  setDirectorVerified: (verified) => {
    if (typeof window !== "undefined") {
      if (verified) {
        localStorage.setItem(DIRECTOR_CODE_KEY, "true");
        localStorage.setItem(DIRECTOR_CODE_TS_KEY, Date.now().toString());
      } else {
        localStorage.removeItem(DIRECTOR_CODE_KEY);
        localStorage.removeItem(DIRECTOR_CODE_TS_KEY);
      }
    }
    set({ directorVerified: verified });
  },

  clearDirectorVerified: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DIRECTOR_CODE_KEY);
      localStorage.removeItem(DIRECTOR_CODE_TS_KEY);
    }
    set({ directorVerified: false });
  },

  isDirectorCodeValid: (code) => {
    const clean = code.trim().toUpperCase();
    return clean === DIRECTOR_SIGNUP_CODE;
  },
}));
