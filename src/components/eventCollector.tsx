import { RelayContext } from '@components/relaysProvider';

import { hasNewerNoteAtom } from '@stores/note';

import { dateToUnix } from '@utils/getDate';
import { fetchMetadata } from '@utils/metadata';
import { getParentID, pubkeyArray } from '@utils/transform';

import useLocalStorage, { writeStorage } from '@rehooks/local-storage';
import { window } from '@tauri-apps/api';
import { TauriEvent } from '@tauri-apps/api/event';
import { useSetAtom } from 'jotai';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export default function EventCollector() {
  const [pool, relays]: any = useContext(RelayContext);

  const [isOnline] = useState(true);
  const setHasNewerNote = useSetAtom(hasNewerNoteAtom);

  const [activeAccount]: any = useLocalStorage('activeAccount', {});
  const [follows] = useLocalStorage('activeAccountFollows', []);

  const now = useRef(new Date());
  const unsubscribe = useRef(null);
  const unlisten = useRef(null);

  const createFollowingPlebs = useCallback(
    async (tags) => {
      const { createPleb } = await import('@utils/bindings');
      for (const tag of tags) {
        const pubkey = tag[1];
        const metadata: any = await fetchMetadata(pubkey);

        createPleb({
          pleb_id: pubkey + '-lume' + activeAccount.id.toString(),
          pubkey: pubkey,
          kind: 0,
          metadata: metadata.content,
          account_id: activeAccount.id,
        }).catch(console.error);
      }
    },
    [activeAccount.id]
  );

  const subscribe = useCallback(async () => {
    const { createNote } = await import('@utils/bindings');
    const { createChat } = await import('@utils/bindings');
    const { createChannel } = await import('@utils/bindings');

    unsubscribe.current = pool.subscribe(
      [
        {
          kinds: [1],
          authors: pubkeyArray(follows),
          since: dateToUnix(now.current),
        },
        {
          kinds: [3],
          authors: [activeAccount.pubkey],
        },
        {
          kinds: [4],
          '#p': [activeAccount.pubkey],
          since: dateToUnix(now.current),
        },
        {
          kinds: [40],
          since: dateToUnix(now.current),
        },
      ],
      relays,
      (event) => {
        if (event.kind === 1) {
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
          })
            .then(() =>
              // notify user reload to get newer note
              setHasNewerNote(true)
            )
            .catch(console.error);
        } else if (event.kind === 3) {
          createFollowingPlebs(event.tags);
        } else if (event.kind === 4) {
          if (event.pubkey !== activeAccount.pubkey) {
            createChat({ pubkey: event.pubkey, created_at: event.created_at, account_id: activeAccount.id }).catch(
              console.error
            );
          }
        } else if (event.kind === 40) {
          createChannel({ event_id: event.id, content: event.content, account_id: activeAccount.id }).catch(
            console.error
          );
        } else {
          console.error;
        }
      }
    );
  }, [pool, relays, activeAccount.id, activeAccount.pubkey, follows, setHasNewerNote, createFollowingPlebs]);

  const listenWindowClose = useCallback(async () => {
    unlisten.current = window.getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
      writeStorage('lastLogin', now.current);
      window.getCurrent().close();
    });
  }, []);

  useEffect(() => {
    subscribe();
    listenWindowClose();

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
      unlisten.current();
    };
  }, [setHasNewerNote, subscribe, listenWindowClose]);

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
