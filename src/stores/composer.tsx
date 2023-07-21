import { create } from 'zustand';

interface ComposerState {
  open: boolean;
  reply: { id: string; pubkey: string; root?: string };
  toggleModal: (status: boolean) => void;
  setReply: (id: string, pubkey: string) => void;
  clearReply: () => void;
}

export const useComposer = create<ComposerState>((set) => ({
  open: false,
  reply: { id: null, root: null, pubkey: null },
  toggleModal: (status: boolean) => {
    set({ open: status });
  },
  setReply: (id: string, pubkey: string, root?: string) => {
    set({ reply: { id: id, root: root, pubkey: pubkey } });
    set({ open: true });
  },
  clearReply: () => {
    set({ reply: { id: null, root: null, pubkey: null } });
  },
}));
