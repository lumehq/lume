import { getChannels } from "@utils/storage";
import { create } from "zustand";

export const useChannels = create((set) => ({
	channels: [],
	fetch: async () => {
		const response = await getChannels(10, 0);
		set({ channels: response });
	},
}));

export const useChannelMessage = create((set) => ({
	messages: [],
	add: (message: any) => {
		set((state: any) => ({ messages: [...state.messages, message] }));
	},
}));
