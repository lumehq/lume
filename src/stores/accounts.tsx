import {
	addBlockToDB,
	createAccount,
	getActiveAccount,
	getBlocks,
	getLastLogin,
	removeBlockFromDB,
	updateAccount,
} from "@libs/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useActiveAccount = create(
	immer(
		persist(
			(set: any, get: any) => ({
				account: null,
				blocks: null,
				lastLogin: null,
				create: async (npub: string, pubkey: string, privkey: string) => {
					const response = await createAccount(npub, pubkey, privkey, null, 1);
					if (response) {
						const activeAccount = await getActiveAccount();
						await addBlockToDB(
							activeAccount.id,
							0,
							"Freedom Awaits",
							"https://void.cat/d/88M2kWHtjZLRtdyfAajHbu.webp",
						);
						set({
							account: activeAccount,
						});
					}
				},
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
					const account = get().account;
					// update db
					updateAccount("follows", list, account.pubkey);
					// update state
					set((state: any) => ({
						account: { ...state.account, follows: JSON.stringify(list) },
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
