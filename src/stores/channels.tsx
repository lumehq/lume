import { getChannels } from "@utils/storage";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useChannels = create((set) => ({
	channels: [],
	fetch: async () => {
		const response = await getChannels(10, 0);
		set({ channels: response });
	},
}));

export const useChannelMessages = create(
	immer((set) => ({
		messages: [],
		replyTo: { id: null, pubkey: null, content: null },
		add: (message: any) => {
			set((state: any) => ({ messages: [...state.messages, message] }));
		},
		openReply: (id: string, pubkey: string, content: string) => {
			set(() => ({ replyTo: { id, pubkey, content } }));
		},
		closeReply: () => {
			set(() => ({ replyTo: { id: null, pubkey: null, content: null } }));
		},
		hideMessage: (id: string) => {
			set((state) => {
				const target = state.messages.findIndex((m) => m.id === id);
				state.messages[target]["hide"] = true;
			});
		},
		muteUser: (pubkey: string) => {
			set((state) => {
				const target = state.messages.findIndex((m) => m.pubkey === pubkey);
				state.messages[target]["mute"] = true;
			});
		},
		clear: () => {
			set(() => ({
				messages: [],
				replyTo: { id: null, pubkey: null, content: null },
			}));
		},
	})),
);
