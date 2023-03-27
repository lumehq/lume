import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { hasNewerNoteAtom } from '@stores/note';
import { relaysAtom } from '@stores/relays';

import { dateToUnix } from '@utils/getDate';
import { createCacheNote, getAllFollowsByID, updateLastLoginTime } from '@utils/storage';
import { pubkeyArray } from '@utils/transform';

import { TauriEvent } from '@tauri-apps/api/event';
import { appWindow, getCurrent } from '@tauri-apps/api/window';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export default function NoteConnector() {
  const pool: any = useContext(RelayContext);

  const setHasNewerNote = useSetAtom(hasNewerNoteAtom);
  const relays = useAtomValue(relaysAtom);
  const [activeAccount] = useAtom(activeAccountAtom);

  const [isOnline] = useState(true);
  const now = useRef(new Date());

  const subscribe = useCallback(() => {
    getAllFollowsByID(activeAccount.id).then((follows) => {
      pool.subscribe(
        [
          {
            kinds: [1],
            authors: pubkeyArray(follows),
            since: dateToUnix(now.current),
          },
        ],
        relays,
        (event: any) => {
          // insert event to local database
          createCacheNote(event);
          setHasNewerNote(true);
        }
      );
    });
  }, [activeAccount.id, pool, relays, setHasNewerNote]);

  useEffect(() => {
    subscribe();
    getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
      updateLastLoginTime(now.current);
      appWindow.close();
    });
  }, [activeAccount.id, pool, relays, setHasNewerNote, subscribe]);

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
}
