import { create } from "zustand";

/**
 * Centralized cross-tab state. Survives tab switches because the store lives
 * outside the route tree.
 */
export interface AppState {
  // CV review
  fileName: string;
  cvText: string;
  jd: string;
  industry: string;
  mode: string;
  // Interview
  interviewProfile: {
    targetRole: string;
    experienceYears: number;
    industry: string;
    focus: string;
  };
  // LinkedIn
  linkedinUrl: string;
  linkedinJobUrl: string;

  set: <K extends keyof Omit<AppState, "set" | "reset">>(k: K, v: AppState[K]) => void;
  reset: () => void;
}

const initial = {
  fileName: "",
  cvText: "",
  jd: "",
  industry: "Consulting",
  mode: "Consulting",
  interviewProfile: { targetRole: "", experienceYears: 0, industry: "", focus: "" },
  linkedinUrl: "",
  linkedinJobUrl: "",
};

export const useAppStore = create<AppState>((set) => ({
  ...initial,
  set: (k, v) => set({ [k]: v } as Partial<AppState>),
  reset: () => set(initial),
}));