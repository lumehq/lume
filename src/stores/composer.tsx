import { create } from 'zustand';

interface ComposerState {
  open: boolean;
  reply: { id: string; root: string; pubkey: string };
  repost: { id: string; pubkey: string };
  toggleModal: (status: boolean) => void;
  setReply: (id: string, root: string, pubkey: string) => void;
  setRepost: (id: string, pubkey: string) => void;
  clearReply: () => void;
  clearRepost: () => void;
}

export const useComposer = create<ComposerState>((set) => ({
  open: false,
  reply: { id: null, root: null, pubkey: null },
  repost: { id: null, pubkey: null },
  toggleModal: (status: boolean) => {
    set({ open: status });
  },
  setReply: (id: string, root: string, pubkey: string) => {
    set({ reply: { id: id, root: root, pubkey: pubkey } });
    set({ repost: { id: null, pubkey: null } });
    set({ open: true });
  },
  setRepost: (id: string, pubkey: string) => {
    set({ repost: { id: id, pubkey: pubkey } });
    set({ reply: { id: null, root: null, pubkey: null } });
    set({ open: true });
  },
  clearReply: () => {
    set({ reply: { id: null, root: null, pubkey: null } });
  },
  clearRepost: () => {
    set({ repost: { id: null, pubkey: null } });
  },
}));
