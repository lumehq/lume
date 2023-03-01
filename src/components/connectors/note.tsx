/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';

import { dateToUnix, hoursAgo } from '@utils/getDate';

import { useLocalStorage } from '@rehooks/local-storage';
import { memo, useCallback, useContext, useRef } from 'react';

export const NoteConnector = memo(function NoteConnector() {
  const db: any = useContext(DatabaseContext);
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
    <div>
      <p>Note</p>
    </div>
  );
});
