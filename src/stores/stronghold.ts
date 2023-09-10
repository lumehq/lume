import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StrongholdState {
  privkey: null | string;
  walletConnectURL: null | string;
  setPrivkey: (privkey: string) => void;
  setWalletConnectURL: (uri: string) => void;
  clearPrivkey: () => void;
}

export const useStronghold = create<StrongholdState>()(
  persist(
    (set) => ({
      privkey: null,
      walletConnectURL: null,
      setPrivkey: (privkey: string) => {
        set({ privkey: privkey });
      },
      setWalletConnectURL: (uri: string) => {
        set({ walletConnectURL: uri });
      },
      clearPrivkey: () => {
        set({ privkey: null });
      },
    }),
    {
      name: 'stronghold',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
