import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export const chatMessagesAtom = atomWithReset([]);
export const sortedChatMessagesAtom = atom((get) => {
  const messages = get(chatMessagesAtom);
  return messages.sort((x: { created_at: number }, y: { created_at: number }) => x.created_at - y.created_at);
});
