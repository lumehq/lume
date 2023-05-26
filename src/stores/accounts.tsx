import { getActiveAccount } from "@utils/storage";
import { create } from "zustand";

export const useActiveAccount = create((set) => ({
	account: null,
	fetch: async () => {
		const response = await getActiveAccount();
		set({ account: response });
	},
	updateFollows: (list: any) => {
		set((state: any) => ({ account: { ...state.account, follows: list } }));
	},
}));
