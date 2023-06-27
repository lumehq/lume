import { create } from "zustand";

interface NoteState {
	hasNewNote: boolean;
	toggleHasNewNote: (by: boolean) => void;
}

export const useNote = create<NoteState>((set) => ({
	hasNewNote: false,
	toggleHasNewNote: (status: boolean) => {
		set({ hasNewNote: status });
	},
}));
