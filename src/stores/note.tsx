import { atom } from 'jotai';
import { atomsWithQuery } from 'jotai-tanstack-query';
import Database from 'tauri-plugin-sql-api';

// usecase: notify user that connector has receive newer note
export const hasNewerNoteAtom = atom(false);
// usecase: get all notes (limit 1000)
export const [initialNotesAtom] = atomsWithQuery(() => ({
  queryFn: async () => {
    const db = await Database.load('sqlite:lume.db');
    const result = await db.select(`SELECT * FROM cache_notes ORDER BY created_at DESC LIMIT 1000`);
    return result;
  },
}));
