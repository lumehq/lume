import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createChannelMessage, getChannelMessages, getChannels } from '@libs/storage';

import { LumeEvent } from '@utils/types';

export const useChannels = create(
  immer((set) => ({
    channels: [],
    fetch: async () => {
      const response = await getChannels();
      set({ channels: response });
    },
    add: (event) => {
      set((state) => {
        const target = state.channels.findIndex(
          (m: { event_id: string }) => m.event_id === event.id
        );
        if (target !== -1) {
          state.channels[target]['new_messages'] =
            state.channels[target]['new_messages'] + 1 || 1;
        } else {
          state.channels.push({ event_id: event.id, ...event });
        }
      });
    },
    clearBubble: (id: string) => {
      set((state) => {
        const target = state.channels.findIndex(
          (m: { event_id: string }) => m.event_id === id
        );
        state.channels[target]['new_messages'] = 0;
      });
    },
  }))
);

export const useChannelMessages = create(
  immer((set) => ({
    messages: [],
    replyTo: { id: null, pubkey: null, content: null },
    fetch: async (id: string) => {
      const events = await getChannelMessages(id);
      set({ messages: events });
    },
    add: (id, event: LumeEvent) => {
      set((state: any) => {
        createChannelMessage(
          id,
          event.id,
          event.pubkey,
          event.kind,
          event.content,
          event.tags,
          event.created_at
        );
        state.messages.push({
          event_id: event.id,
          channel_id: id,
          hide: 0,
          mute: 0,
          ...event,
        });
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
        state.messages[target]['hide'] = true;
      });
    },
    muteUser: (pubkey: string) => {
      set((state) => {
        const target = state.messages.findIndex((m) => m.pubkey === pubkey);
        state.messages[target]['mute'] = true;
      });
    },
    clear: () => {
      set(() => ({
        messages: [],
        replyTo: { id: null, pubkey: null, content: null },
      }));
    },
  }))
);
