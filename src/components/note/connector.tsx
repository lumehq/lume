import { RelayContext } from '@components/relaysProvider';

import { lastLoginAtom } from '@stores/account';
import { hasNewerNoteAtom } from '@stores/note';

import { dateToUnix } from '@utils/getDate';
import { getParentID, pubkeyArray } from '@utils/transform';

import { TauriEvent } from '@tauri-apps/api/event';
import { appWindow, getCurrent } from '@tauri-apps/api/window';
import { useSetAtom } from 'jotai';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export default function NoteConnector() {
  const [pool, relays]: any = useContext(RelayContext);

  const setLastLoginAtom = useSetAtom(lastLoginAtom);
  const setHasNewerNote = useSetAtom(hasNewerNoteAtom);

  const [isOnline] = useState(true);

  const now = useRef(new Date());
  const unsubscribe = useRef(null);

  const subscribe = useCallback(async () => {
    const { createNote } = await import('@utils/bindings');
    const activeAccount = JSON.parse(localStorage.getItem('activeAccount'));
    const follows = JSON.parse(localStorage.getItem('activeAccountFollows'));

    unsubscribe.current = pool.subscribe(
      [
        {
          kinds: [1],
          authors: pubkeyArray(follows),
          since: dateToUnix(now.current),
        },
      ],
      relays,
      (event) => {
        const parentID = getParentID(event.tags, event.id);
        // insert event to local database
        createNote({
          event_id: event.id,
          pubkey: event.pubkey,
          kind: event.kind,
          tags: JSON.stringify(event.tags),
          content: event.content,
          parent_id: parentID,
          parent_comment_id: '',
          created_at: event.created_at,
          account_id: activeAccount.id,
        }).catch(console.error);
        // notify user reload to get newer note
        setHasNewerNote(true);
      }
    );
  }, [pool, relays, setHasNewerNote]);

  useEffect(() => {
    subscribe();
    getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
      setLastLoginAtom(now.current);
      appWindow.close();
    });

    return () => {
      unsubscribe.current;
    };
  }, [setHasNewerNote, setLastLoginAtom, subscribe]);

  return (
    <div className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-zinc-900">
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
  );
}
