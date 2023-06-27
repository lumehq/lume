import { create } from "zustand";

interface ComposerState {
	open: boolean;
	reply: null;
	repost: { id: string; pubkey: string };
	toggleModal: (status: boolean) => void;
	setRepost: (id: string, pubkey: string) => void;
	clearRepost: () => void;
}

export const useComposer = create<ComposerState>((set) => ({
	open: false,
	reply: null,
	repost: { id: null, pubkey: null },
	toggleModal: (status: boolean) => {
		set({ open: status });
		if (!status) {
			set({ repost: { id: null, pubkey: null } });
		}
	},
	setRepost: (id: string, pubkey: string) => {
		set({ repost: { id: id, pubkey: pubkey } });
		set({ open: true });
	},
	clearRepost: () => {
		set({ repost: { id: null, pubkey: null } });
	},
}));
