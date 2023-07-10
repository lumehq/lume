import { create } from 'zustand';

interface OnboardingState {
  profile: { [x: string]: string };
  pubkey: string;
  privkey: string;
  createProfile: (data: { [x: string]: string }) => void;
  setPubkey: (pubkey: string) => void;
  setPrivkey: (privkey: string) => void;
  clearPrivkey: (privkey: string) => void;
}

export const useOnboarding = create<OnboardingState>((set) => ({
  profile: {},
  pubkey: '',
  privkey: '',
  createProfile: (data: { [x: string]: string }) => {
    set({ profile: data });
  },
  setPubkey: (pubkey: string) => {
    set({ pubkey: pubkey });
  },
  setPrivkey: (privkey: string) => {
    set({ privkey: privkey });
  },
  clearPrivkey: () => {
    set({ privkey: '' });
  },
}));
