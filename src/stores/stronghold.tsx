import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StrongholdState {
  privkey: null | string;
  setPrivkey: (privkey: string) => void;
}

export const useStronghold = create<StrongholdState>()(
  persist(
    (set) => ({
      privkey: null,
      setPrivkey: (privkey: string) => {
        set({ privkey: privkey });
      },
    }),
    {
      name: 'stronghold',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
