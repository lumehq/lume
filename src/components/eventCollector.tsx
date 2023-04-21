'use client';

import { NetworkStatusIndicator } from '@components/networkStatusIndicator';
import { RelayContext } from '@components/relaysProvider';

import { hasNewerNoteAtom } from '@stores/note';

import { dateToUnix } from '@utils/getDate';
import { createChannel, createChat, createNote, updateAccount } from '@utils/storage';
import { getParentID, nip02ToArray } from '@utils/transform';

import useLocalStorage from '@rehooks/local-storage';
import { useSetAtom } from 'jotai';
import { useCallback, useContext, useEffect, useRef } from 'react';

export default function EventCollector() {
  const [pool, relays]: any = useContext(RelayContext);
  const [activeAccount]: any = useLocalStorage('account', {});

  const setHasNewerNote = useSetAtom(hasNewerNoteAtom);
  const follows = JSON.parse(activeAccount.follows);

  const now = useRef(new Date());

  const subscribe = useCallback(async () => {
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
        {
          kinds: [40],
          since: dateToUnix(now.current),
        },
      ],
      relays,
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
          // channel
          case 40:
            createChannel(event.id, event.content, event.created_at);
            break;
          default:
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activeAccount.pubkey, activeAccount.id, follows, pool, relays, setHasNewerNote]);

  useEffect(() => {
    subscribe();
  }, [setHasNewerNote, subscribe]);

  return <NetworkStatusIndicator />;
}
