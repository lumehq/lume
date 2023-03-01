/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';

import { dateToUnix, hoursAgo } from '@utils/getDate';

import { useLocalStorage } from '@rehooks/local-storage';
import { memo, useCallback, useContext, useRef } from 'react';

export const NoteConnector = memo(function NoteConnector() {
  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const now = useRef(new Date());

  const [follows]: any = useLocalStorage('follows');
  const [relays]: any = useLocalStorage('relays');

  const insertDB = useCallback(
    async (event: any) => {
      await db.execute(
        `INSERT OR IGNORE INTO
          cache_notes
            (id, pubkey, created_at, kind, tags, content) VALUES
            ("${event.id}", "${event.pubkey}", "${event.created_at}", "${event.kind}", '${JSON.stringify(event.tags)}', "${event.content}");`
      );
    },
    [db]
  );

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
      insertDB(event).catch(console.error);
    },
    undefined,
    (events: any, relayURL: any) => {
      console.log(events, relayURL);
    }
  );

  return (
    <div className="flex h-12 items-center justify-between border-b border-zinc-800 px-6 shadow-input">
      <div>
        <h3 className="text-sm font-semibold text-zinc-500"># following</h3>
      </div>
      <div>
        <div className="inline-flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
          <p className="text-sm font-medium text-zinc-500">Online</p>
        </div>
      </div>
    </div>
  );
});
