import { atomWithReset } from 'jotai/utils';

export const composerAtom = atomWithReset({ type: 'post', content: '' });
