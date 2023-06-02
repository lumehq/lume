import {
	addBlockToDB,
	getActiveAccount,
	getBlocks,
	getLastLogin,
	removeBlockFromDB,
} from "@utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useActiveAccount = create(
	immer(
		persist(
			(set: any, get: any) => ({
				account: null,
				blocks: null,
				lastLogin: 0,
				fetch: async () => {
					const response = await getActiveAccount();
					set({ account: response });
				},
				fetchLastLogin: async () => {
					const response = await getLastLogin();
					set({ lastLogin: parseInt(response) });
				},
				fetchBlocks: async () => {
					const account = get().account;
					const response = await getBlocks(account.id);
					set({ blocks: response });
				},
				addBlock: (kind: number, title: string, content: string) => {
					const account = get().account;
					// add to db
					addBlockToDB(account.id, kind, title, content);
					// update state
					set((state: any) => ({
						blocks: [
							...state.blocks,
							{
								id: account.id + kind,
								account_id: account.id,
								kind,
								title,
								content,
							},
						],
					}));
				},
				removeBlock: (id: string) => {
					// remove from db
					removeBlockFromDB(id);
					// update state
					set((state: any) => {
						const target = state.blocks.findIndex(
							(b: { id: string }) => b.id === id,
						);
						state.blocks.splice(target, 1);
					});
				},
				updateFollows: (list: any) => {
					set((state: any) => ({
						account: { ...state.account, follows: list },
					}));
				},
			}),
			{
				name: "account",
				storage: createJSONStorage(() => sessionStorage),
			},
		),
	),
);
