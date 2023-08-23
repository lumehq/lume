import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  step: null | string;
  pubkey: null | string;
  tempPrivkey: null | string;
  setPubkey: (pubkey: string) => void;
  setTempPrivkey: (privkey: string) => void;
  setStep: (url: string) => void;
  clearStep: () => void;
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      step: null,
      pubkey: null,
      tempPrivkey: null,
      setPubkey: (pubkey: string) => {
        set({ pubkey });
      },
      setTempPrivkey: (privkey: string) => {
        set({ tempPrivkey: privkey });
      },
      setStep: (url: string) => {
        set({ step: url });
      },
      clearStep: () => {
        set({ step: null, pubkey: null, tempPrivkey: null });
      },
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
