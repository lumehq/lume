import { DEFAULT_CHANNELS } from '@stores/constants';

import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

// channel list
export const defaultChannelsAtom = atom(DEFAULT_CHANNELS);
export const channelsAtom = atom(async (get) => {
  const { getChannels } = await import('@utils/storage');
  const result: any = await getChannels(100, 0);
  return get(defaultChannelsAtom).concat(result);
});

// channel reply id
export const channelReplyAtom = atomWithReset({ id: null, pubkey: null, content: null });

// channel messages
export const channelMessagesAtom = atomWithReset([]);
export const sortedChannelMessagesAtom = atom((get) => {
  const messages = get(channelMessagesAtom);
  return messages.sort((x: { created_at: number }, y: { created_at: number }) => x.created_at - y.created_at);
});

// channel message content
export const channelContentAtom = atomWithReset('');
