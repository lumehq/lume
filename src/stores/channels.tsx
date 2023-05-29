import { getChannels } from "@utils/storage";
import { create } from "zustand";

export const useChannels = create((set) => ({
	channels: [],
	fetch: async () => {
		const response = await getChannels(10, 0);
		set({ channels: response });
	},
}));

export const useChannelMessages = create((set) => ({
	messages: [],
	replyTo: null,
	add: (message: any) => {
		set((state: any) => ({ messages: [...state.messages, message] }));
	},
}));
