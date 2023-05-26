import { getChatMessages, getChatsByPubkey } from "@utils/storage";
import { create } from "zustand";

export const useChats = create((set) => ({
	chats: [],
	fetch: async (pubkey: string) => {
		const response = await getChatsByPubkey(pubkey);
		set({ chats: response });
	},
}));

export const useChatMessages = create((set) => ({
	messages: [],
	fetch: async (receiver_pubkey: string, sender_pubkey: string) => {
		const response = await getChatMessages(receiver_pubkey, sender_pubkey);
		set({ messages: response });
	},
	add: (message: any) => {
		set((state: any) => ({ messages: [...state.messages, message] }));
	},
}));
