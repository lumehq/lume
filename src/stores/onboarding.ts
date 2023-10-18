import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  enrich: boolean;
  hashtag: boolean;
  circle: boolean;
  relays: boolean;
  outbox: boolean;
  notification: boolean;
  toggleEnrich: () => void;
  toggleHashtag: () => void;
  toggleCircle: () => void;
  toggleRelays: () => void;
  toggleOutbox: () => void;
  toggleNotification: () => void;
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      enrich: false,
      hashtag: false,
      circle: false,
      relays: false,
      outbox: false,
      notification: false,
      toggleEnrich: () => set((state) => ({ enrich: !state.enrich })),
      toggleHashtag: () => set((state) => ({ hashtag: !state.hashtag })),
      toggleCircle: () => set((state) => ({ circle: !state.circle })),
      toggleRelays: () => set((state) => ({ relays: !state.relays })),
      toggleOutbox: () => set((state) => ({ outbox: !state.outbox })),
      toggleNotification: () => set((state) => ({ notification: !state.notification })),
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
