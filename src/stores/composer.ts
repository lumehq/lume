import { create } from 'zustand';

interface ComposerState {
  expand: boolean;
  open: boolean;
  reply: { id: string; pubkey: string; root?: string };
  toggleModal: () => void;
  toggleExpand: () => void;
  setReply: (id: string, pubkey: string, root?: string) => void;
  clearReply: () => void;
}

export const useComposer = create<ComposerState>((set) => ({
  expand: false,
  open: false,
  reply: { id: null, pubkey: null, root: null },
  toggleModal: () => {
    set((state) => ({ open: !state.open }));
  },
  toggleExpand: () => {
    set((state) => ({ expand: !state.expand }));
  },
  setReply: (id: string, pubkey: string, root?: string) => {
    set({ reply: { id: id, pubkey: pubkey, root: root } });
    set({ open: true });
  },
  clearReply: () => {
    set({ reply: { id: null, pubkey: null, root: null } });
  },
}));
