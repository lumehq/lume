import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';
import { Content } from '@components/note/content';

import useLocalStorage from '@rehooks/local-storage';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const RootNote = memo(function RootNote({ id }: { id: string }) {
  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const [relays]: any = useLocalStorage('relays');
  const [event, setEvent] = useState(null);

  const insertDB = useCallback(
    async (event: any) => {
      // insert to local database
      await db.execute(
        'INSERT OR IGNORE INTO cache_notes (id, pubkey, created_at, kind, content, tags, is_root) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [event.id, event.pubkey, event.created_at, event.kind, event.content, String(event.tags), 1]
      );
    },
    [db]
  );

  const getData = useCallback(async () => {
    const result = await db.select(`SELECT * FROM cache_notes WHERE id = "${id}"`);
    return result[0];
  }, [db, id]);

  const fetchEvent = useCallback(() => {
    relayPool.subscribe(
      [
        {
          ids: [id],
          kinds: [1],
        },
      ],
      relays,
      (event: any) => {
        // update state
        setEvent(event);
        // insert to database
        insertDB(event);
      },
      undefined,
      (events, relayURL) => {
        console.log(events, relayURL);
      },
      {
        unsubscribeOnEose: true,
      }
    );
  }, [id, insertDB, relayPool, relays]);

  useEffect(() => {
    getData()
      .then((res) => {
        if (res) {
          setEvent(res);
        } else {
          fetchEvent();
        }
      })
      .catch(console.error);
  }, [fetchEvent, getData]);

  if (event) {
    return (
      <div className="relative pb-5">
        <div className="absolute top-0 left-[21px] h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
        <Content data={event} />
      </div>
    );
  } else {
    return (
      <div className="relative z-10 flex h-min animate-pulse select-text flex-col pb-5">
        <div className="flex items-start gap-2">
          <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-700" />
          <div className="flex w-full flex-1 items-start justify-between">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-16 rounded bg-zinc-700" />
                <span className="text-zinc-500">·</span>
                <div className="h-4 w-12 rounded bg-zinc-700" />
              </div>
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
            </div>
          </div>
        </div>
        <div className="-mt-5 pl-[52px]">
          <div className="flex flex-col gap-6">
            <div className="h-16 w-full rounded bg-zinc-700" />
            <div className="flex items-center gap-8">
              <div className="h-4 w-12 rounded bg-zinc-700" />
              <div className="h-4 w-12 rounded bg-zinc-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
