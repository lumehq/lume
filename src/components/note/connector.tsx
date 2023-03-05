import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';

import { dateToUnix, hoursAgo } from '@utils/getDate';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useLocalStorage } from '@rehooks/local-storage';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';

export const NoteConnector = memo(function NoteConnector({
  setParentReload,
  setHasNewNote,
  currentDate,
}: {
  setParentReload: any;
  setHasNewNote: any;
  currentDate: any;
}) {
  const { db }: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const [follows]: any = useLocalStorage('follows');
  const [relays]: any = useLocalStorage('relays');

  const [reload, setReload] = useState(false);
  const timeout = useRef(null);

  const reloadNewsfeed = () => {
    setParentReload(true);
    setReload(true);
    timeout.current = setTimeout(() => {
      setReload(false);
    }, 2000);
  };

  const insertDB = useCallback(
    async (event: any) => {
      await db.execute(
        `INSERT OR IGNORE INTO
          cache_notes
            (id, pubkey, created_at, kind, tags, content) VALUES
            (
              "${event.id}",
              "${event.pubkey}",
              "${event.created_at}",
              "${event.kind}",
              '${JSON.stringify(event.tags)}',
              "${event.content}"
            );`
      );
    },
    [db]
  );

  const fetchEvent = useCallback(() => {
    relayPool.subscribe(
      [
        {
          kinds: [1],
          authors: follows,
          since: dateToUnix(hoursAgo(12, currentDate)),
        },
      ],
      relays,
      (event: any) => {
        // show trigger update newer event
        if (event.created_at > dateToUnix(currentDate)) {
          setHasNewNote(true);
        }
        // insert event to local database
        insertDB(event).catch(console.error);
      },
      undefined,
      (events: any, relayURL: any) => {
        console.log(events, relayURL);
      }
    );
  }, [relayPool, follows, currentDate, relays, insertDB, setHasNewNote]);

  useEffect(() => {
    fetchEvent();

    return () => {
      clearTimeout(timeout.current);
    };
  }, [fetchEvent]);

  return (
    <div className="relative flex h-12 items-center justify-between border-b border-zinc-800 px-6 shadow-input">
      <div>
        <h3 className="text-sm font-semibold text-zinc-500"># following</h3>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => reloadNewsfeed()}
          className={`${reload ? 'animate-spin' : ''} rounded-full p-1 hover:bg-zinc-800`}
        >
          <ReloadIcon className="h-3.5 w-3.5 text-zinc-500" />
        </button>
        <div className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1">
          {/* #TODO: get user network status */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
          </span>
          <p className="text-xs font-medium text-zinc-500">Online</p>
        </div>
      </div>
    </div>
  );
});
