import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';

import { atomHasNewerNote } from '@stores/note';

import { dateToUnix, hoursAgo } from '@utils/getDate';

import { useLocalStorage } from '@rehooks/local-storage';
import { useSetAtom } from 'jotai';
import { memo, useCallback, useContext, useMemo, useRef } from 'react';

export const NoteConnector = memo(function NoteConnector() {
  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const [follows]: any = useLocalStorage('follows');
  const [relays]: any = useLocalStorage('relays');

  const setHasNewerNote = useSetAtom(atomHasNewerNote);
  const now = useRef(new Date());

  const insertDB = useCallback(
    async (event: any) => {
      // insert to local database
      await db.execute(
        'INSERT OR IGNORE INTO cache_notes (id, pubkey, created_at, kind, content, tags) VALUES (?, ?, ?, ?, ?, ?);',
        [event.id, event.pubkey, event.created_at, event.kind, event.content, JSON.stringify(event.tags)]
      );
    },
    [db]
  );

  useMemo(() => {
    relayPool.subscribe(
      [
        {
          kinds: [1],
          authors: follows,
          since: dateToUnix(hoursAgo(12, now.current)),
        },
      ],
      relays,
      (event: any) => {
        // insert event to local database
        insertDB(event).catch(console.error);
        // ask user load newer note
        if (event.created_at > dateToUnix(now.current)) {
          setHasNewerNote(true);
        }
      }
    );
  }, [relayPool, follows, relays, insertDB, setHasNewerNote]);

  return (
    <>
      <div className="inline-flex items-center gap-1 rounded-md py-1 px-1.5 hover:bg-zinc-900">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
        </span>
        <p className="text-xs font-medium text-zinc-500">Relays</p>
      </div>
    </>
  );
});
