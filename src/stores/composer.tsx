import { create } from "zustand";

export const useComposer = create((set) => ({
	open: false,
	repost: { id: null, pubkey: null },
	reply: null,
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
