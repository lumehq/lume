import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

// notes
export const notesAtom = atom([]);
export const filteredNotesAtom = atom((get) => {
  const notes = get(notesAtom);
  return notes.filter((item, index) => index === notes.findIndex((other) => item.parent_id === other.parent_id));
});

// note content
export const noteContentAtom = atomWithReset('');

// notify user that connector has receive newer note
export const hasNewerNoteAtom = atom(false);
