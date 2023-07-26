import { create } from 'zustand';

interface OnboardingState {
  profile: { [x: string]: string };
  pubkey: string;
  createProfile: (data: { [x: string]: string }) => void;
  setPubkey: (pubkey: string) => void;
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
}));
