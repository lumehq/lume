import { createChat, getChatMessages, getChatsByPubkey } from "@libs/storage";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useChats = create(
	immer((set: any) => ({
		chats: [],
		fetch: async (pubkey: string) => {
			const response: any = await getChatsByPubkey(pubkey);
			set({ chats: response });
		},
		add: async (pubkey: string) => {
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
	add: async (receiver: string, event: any) => {
		const save = await createChat(
			event.id,
			receiver,
			event.pubkey,
			event.content,
			event.tags,
			event.created_at,
		);
		if (save) {
			set((state: any) => ({
				messages: [
					...state.messages,
					{ ...event, sender_pubkey: event.pubkey, receiver_pubkey: receiver },
				],
			}));
		}
	},
	clear: () => {
		set(() => ({ messages: [] }));
	},
}));
