import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { hasNewerNoteAtom } from '@stores/note';
import { relaysAtom } from '@stores/relays';

import { dateToUnix, hoursAgo } from '@utils/getDate';
import { createCacheNote, getAllFollowsByID } from '@utils/storage';
import { pubkeyArray } from '@utils/transform';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useContext, useEffect, useRef, useState } from 'react';

export const NoteConnector = memo(function NoteConnector() {
  const pool: any = useContext(RelayContext);

  const setHasNewerNote = useSetAtom(hasNewerNoteAtom);
  const relays = useAtomValue(relaysAtom);
  const [activeAccount] = useAtom(activeAccountAtom);

  const [isOnline] = useState(true);
  const now = useRef(new Date());

  useEffect(() => {
    getAllFollowsByID(activeAccount.id).then((follows) => {
      pool.subscribe(
        [
          {
            kinds: [1],
            authors: pubkeyArray(follows),
            since: dateToUnix(hoursAgo(12, now.current)),
          },
        ],
        relays,
        (event: any) => {
          // insert event to local database
          createCacheNote(event);
          // ask user load newer note
          if (event.created_at > dateToUnix(now.current)) {
            setHasNewerNote(true);
          }
        }
      );
    });
  }, [activeAccount.id, pool, relays, setHasNewerNote]);

  return (
    <>
      <div className="inline-flex items-center gap-1 rounded-md py-1 px-1.5 hover:bg-zinc-900">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              isOnline ? 'bg-green-400' : 'bg-red-400'
            }`}
          ></span>
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-400' : 'bg-amber-400'}`}
          ></span>
        </span>
        <p className="text-xs font-medium text-zinc-500">{isOnline ? 'Online' : 'Offline'}</p>
      </div>
    </>
  );
});
