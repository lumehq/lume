import { getChatMessages, getChatsByPubkey } from "@utils/storage";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useChats = create(
	immer((set: any) => ({
		chats: [],
		fetch: async (pubkey: string) => {
			const response: any = await getChatsByPubkey(pubkey);
			set({ chats: response });
		},
		add: (pubkey: string) => {
			set((state) => {
				const target = state.chats.findIndex(
					(m: { sender_pubkey: string }) => m.sender_pubkey === pubkey,
				);
				if (target !== -1) {
					state.chats[target]["new_messages"] =
						state.chats[target]["new_messages"] + 1 || 1;
				} else {
					state.chats.push({ sender_pubkey: pubkey, new_messages: 1 });
				}
			});
		},
		clearBubble: (pubkey: string) => {
			set((state) => {
				const target = state.chats.findIndex(
					(m: { sender_pubkey: string }) => m.sender_pubkey === pubkey,
				);
				state.chats[target]["new_messages"] = 0;
			});
		},
	})),
);

export const useChatMessages = create((set) => ({
	messages: [],
	fetch: async (receiver_pubkey: string, sender_pubkey: string) => {
		const response: any = await getChatMessages(receiver_pubkey, sender_pubkey);
		set({ messages: response });
	},
	add: (message: any) => {
		set((state: any) => ({ messages: [...state.messages, message] }));
	},
	clear: () => {
		set(() => ({ messages: [] }));
	},
}));
