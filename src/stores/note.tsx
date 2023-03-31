import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

// note content
export const noteContentAtom = atomWithReset('');
// notify user that connector has receive newer note
export const hasNewerNoteAtom = atom(false);
