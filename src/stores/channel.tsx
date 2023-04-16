import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

// channel reply id
export const channelReplyAtom = atomWithReset({ id: null, pubkey: null, content: null });
// channel messages
export const channelMessagesAtom = atomWithReset([]);
export const sortedChannelMessagesAtom = atom((get) => {
  const messages = get(channelMessagesAtom);
  return messages.sort((x: { created_at: number }, y: { created_at: number }) => x.created_at - y.created_at);
});
