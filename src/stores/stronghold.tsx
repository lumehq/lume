import { create } from 'zustand';

interface StrongholdState {
  password: null | string;
  privkey: null | string;
  setPassword: (password: string) => void;
  setPrivkey: (privkey: string) => void;
}

export const useStronghold = create<StrongholdState>((set) => ({
  password: null,
  privkey: null,
  setPassword: (password: string) => {
    set({ password: password });
  },
  setPrivkey: (privkey: string) => {
    set({ privkey: privkey });
  },
}));
