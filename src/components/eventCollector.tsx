import { AccountContext } from '@components/accountProvider';
import { NetworkStatusIndicator } from '@components/networkStatusIndicator';
import { RelayContext } from '@components/relaysProvider';

import { READONLY_RELAYS } from '@stores/constants';
import { hasNewerNoteAtom } from '@stores/note';

import { dateToUnix } from '@utils/getDate';
import { createChat, createNote, updateAccount } from '@utils/storage';
import { getParentID, nip02ToArray } from '@utils/transform';

import { useSetAtom } from 'jotai';
import { useCallback, useContext, useEffect, useRef } from 'react';

export default function EventCollector() {
  const pool: any = useContext(RelayContext);
  const activeAccount: any = useContext(AccountContext);

  const setHasNewerNote = useSetAtom(hasNewerNoteAtom);
  const now = useRef(new Date());

  const subscribe = useCallback(async () => {
    const follows = activeAccount.follows ? JSON.parse(activeAccount.follows) : [];
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [1, 6],
          authors: follows,
          since: dateToUnix(now.current),
        },
        {
          kinds: [0, 3],
          authors: [activeAccount.pubkey],
        },
        {
          kinds: [4],
          '#p': [activeAccount.pubkey],
          since: dateToUnix(now.current),
        },
      ],
      READONLY_RELAYS,
      (event: { kind: number; tags: string[]; id: string; pubkey: string; content: string; created_at: number }) => {
        switch (event.kind) {
          // metadata
          case 0:
            updateAccount('metadata', event.content, event.pubkey);
            break;
          // short text note
          case 1:
            const parentID = getParentID(event.tags, event.id);
            createNote(
              event.id,
              activeAccount.id,
              event.pubkey,
              event.kind,
              event.tags,
              event.content,
              event.created_at,
              parentID
            );
            // notify user reload to get newer note
            setHasNewerNote(true);
            break;
          // contacts
          case 3:
            const arr = nip02ToArray(event.tags);
            // update account's folllows with NIP-02 tag list
            updateAccount('follows', arr, event.pubkey);
            break;
          // chat
          case 4:
            if (event.pubkey !== activeAccount.pubkey) {
              createChat(activeAccount.id, event.pubkey, event.created_at);
            }
            break;
          // repost
          case 6:
            createNote(
              event.id,
              activeAccount.id,
              event.pubkey,
              event.kind,
              event.tags,
              event.content,
              event.created_at,
              ''
            );
            break;
          default:
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activeAccount.id, activeAccount.pubkey, activeAccount.follows, pool, setHasNewerNote]);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      subscribe();
    }

    return () => {
      ignore = true;
    };
  }, [subscribe]);

  return <NetworkStatusIndicator />;
}
