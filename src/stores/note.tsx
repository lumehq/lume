import { isSSR } from '@utils/ssr';
import { getAllNotes } from '@utils/storage';

import { atom } from 'jotai';
import { atomsWithQuery } from 'jotai-tanstack-query';
import { atomWithReset } from 'jotai/utils';

// note content
export const noteContentAtom = atomWithReset('');
// notify user that connector has receive newer note
export const hasNewerNoteAtom = atom(false);
// query notes from database
export const [notesAtom] = atomsWithQuery(() => ({
  queryKey: ['notes'],
  queryFn: async ({ queryKey: [] }) => {
    const res = isSSR ? [] : await getAllNotes();
    return res;
  },
  refetchInterval: 1000000,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  keepPreviousData: false,
}));
