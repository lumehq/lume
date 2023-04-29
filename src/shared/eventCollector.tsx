import { NetworkStatusIndicator } from '@lume/shared/networkStatusIndicator';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { hasNewerNoteAtom } from '@lume/stores/note';
import { dateToUnix } from '@lume/utils/getDate';
import { useActiveAccount } from '@lume/utils/hooks/useActiveAccount';
import { createChat, createNote, updateAccount } from '@lume/utils/storage';
import { getParentID, nip02ToArray } from '@lume/utils/transform';

import { useSetAtom } from 'jotai';
import { useContext, useRef } from 'react';
import useSWRSubscription from 'swr/subscription';

export default function EventCollector() {
  const pool: any = useContext(RelayContext);

  const setHasNewerNote = useSetAtom(hasNewerNoteAtom);
  const now = useRef(new Date());

  const { account, isLoading, isError } = useActiveAccount();

  useSWRSubscription(!isLoading && !isError && account ? ['eventCollector', account] : null, ([, key], {}) => {
    const follows = nip02ToArray(JSON.parse(key.follows));
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [1, 6],
          authors: follows,
          since: dateToUnix(now.current),
        },
        {
          kinds: [0, 3],
          authors: [key.pubkey],
        },
        {
          kinds: [4],
          '#p': [key.pubkey],
          since: dateToUnix(now.current),
        },
      ],
      READONLY_RELAYS,
      (event: any) => {
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
              account.id,
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
            // update account's folllows with NIP-02 tag list
            updateAccount('follows', event.tags, event.pubkey);
            break;
          // chat
          case 4:
            if (event.pubkey !== key.pubkey) {
              createChat(key.id, event.pubkey, event.created_at);
            }
            break;
          // repost
          case 6:
            createNote(
              event.id,
              key.id,
              event.pubkey,
              event.kind,
              event.tags,
              event.content,
              event.created_at,
              event.id
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
  });

  return <NetworkStatusIndicator />;
}
