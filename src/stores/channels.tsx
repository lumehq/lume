import { getChannels } from "@libs/storage";
import NDK, { NDKFilter } from "@nostr-dev-kit/ndk";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useChannels = create(
	immer((set) => ({
		channels: [],
		fetch: async () => {
			const response = await getChannels(10, 0);
			set({ channels: response });
		},
		add: (event) => {
			set((state) => {
				const target = state.channels.findIndex(
					(m: { event_id: string }) => m.event_id === event.id,
				);
				if (target !== -1) {
					state.channels[target]["new_messages"] =
						state.channels[target]["new_messages"] + 1 || 1;
				} else {
					state.channels.push({ event_id: event.id, ...event });
				}
			});
		},
		clearBubble: (id: string) => {
			set((state) => {
				const target = state.channels.findIndex(
					(m: { event_id: string }) => m.event_id === id,
				);
				state.channels[target]["new_messages"] = 0;
			});
		},
	})),
);

export const useChannelMessages = create(
	immer((set) => ({
		messages: [],
		replyTo: { id: null, pubkey: null, content: null },
		fetch: async (ndk: NDK, id: string, since: number) => {
			const filter: NDKFilter = {
				"#e": [id],
				kinds: [42],
				since: since,
			};
			const events = await ndk.fetchEvents(filter);
			const array = [...events];
			set({ messages: array });
		},
		add: (message: any) => {
			set((state: any) => {
				state.messages.push(message);
			});
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
