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
				tempProfile: {},
				account: null,
				blocks: null,
				lastLogin: null,
				createTempProfile: (data: any) => {
					set({ tempProfile: data });
				},
				create: async (npub: string, pubkey: string, privkey: string) => {
					const response = await createAccount(npub, pubkey, privkey, null, 1);
					if (response) {
						const activeAccount = await getActiveAccount();
						await addBlockToDB(
							activeAccount.id,
							0,
							"Lume ❤️ You",
							"https://void.cat/d/5FdJcBP5ZXKAjYqV8hpcp3",
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
				addTempBlock: (
					block: number,
					kind: number,
					title: string,
					content: string,
				) => {
					const account = get().account;
					const target = get().blocks.findIndex(
						(b: { id: number }) => b.id === block,
					);
					// update state
					set((state: any) => {
						state.blocks.splice(target, 0, {
							id: account.id + kind,
							account_id: account.id,
							kind,
							title,
							content,
						});
					});
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
				removeBlock: (id: string, db?: false) => {
					if (db) {
						// remove from db
						removeBlockFromDB(id);
					}
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
