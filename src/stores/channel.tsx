import { atomWithReset } from 'jotai/utils';

// channel reply id
export const channelReplyAtom = atomWithReset({ id: null, pubkey: null, content: null });
