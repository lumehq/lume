import { atom } from 'jotai';

// usecase: notify user that connector has receive newer note
export const hasNewerNoteAtom = atom(false);
// usecase: query notes from database
export const notesAtom = atom([]);
