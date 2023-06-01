import { getActiveAccount, getLastLogin } from "@utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useActiveAccount = create(
	persist(
		(set) => ({
			account: null,
			lastLogin: 0,
			fetch: async () => {
				const response = await getActiveAccount();
				set({ account: response });
			},
			fetchLastLogin: async () => {
				const response = await getLastLogin();
				set({ lastLogin: parseInt(response) });
			},
			updateFollows: (list: any) => {
				set((state: any) => ({ account: { ...state.account, follows: list } }));
			},
		}),
		{
			name: "account",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
