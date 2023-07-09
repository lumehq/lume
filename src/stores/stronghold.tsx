import { create } from 'zustand';

interface StrongholdState {
  password: null | string;
  setPassword: (password: string) => void;
}

export const useStronghold = create<StrongholdState>((set) => ({
  password: null,
  setPassword: (password: string) => {
    set({ password: password });
  },
}));
