import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StrongholdState {
  privkey: null | string;
  walletConnectURL: null | string;
  isFetched: null | boolean;
  setPrivkey: (privkey: string) => void;
  setWalletConnectURL: (uri: string) => void;
  clearPrivkey: () => void;
  setIsFetched: () => void;
}

export const useStronghold = create<StrongholdState>()(
  persist(
    (set) => ({
      privkey: null,
      walletConnectURL: null,
      isFetched: false,
      setPrivkey: (privkey: string) => {
        set({ privkey: privkey });
      },
      setWalletConnectURL: (uri: string) => {
        set({ walletConnectURL: uri });
      },
      clearPrivkey: () => {
        set({ privkey: null });
      },
      setIsFetched: () => {
        set({ isFetched: true });
      },
    }),
    {
      name: 'stronghold',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
