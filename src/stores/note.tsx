import { getAllNotes } from '@utils/storage';

import { atom } from 'jotai';
import { atomsWithQuery } from 'jotai-tanstack-query';

// usecase: notify user that connector has receive newer note
export const hasNewerNoteAtom = atom(false);
// usecase: query notes from database
export const [notesAtom] = atomsWithQuery(() => ({
  queryKey: ['notes'],
  queryFn: async ({ queryKey: [] }) => {
    const res = await getAllNotes();
    return res;
  },
}));
