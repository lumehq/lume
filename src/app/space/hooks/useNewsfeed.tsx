import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useEffect, useRef } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { createNote } from '@libs/storage';

import { useNote } from '@stores/note';

import { useAccount } from '@utils/hooks/useAccount';

export function useNewsfeed() {
  const sub = useRef(null);
  const now = useRef(Math.floor(Date.now() / 1000));

  const { ndk } = useNDK();
  const { status, account } = useAccount();

  const toggleHasNewNote = useNote((state) => state.toggleHasNewNote);

  useEffect(() => {
    if (status === 'success' && account) {
      const filter: NDKFilter = {
        kinds: [1, 6],
        authors: account.follows,
        since: now.current,
      };

      sub.current = ndk.subscribe(filter, { closeOnEose: false });

      sub.current.addListener('event', (event: NDKEvent) => {
        // add to db
        createNote(
          event.id,
          event.pubkey,
          event.kind,
          event.tags,
          event.content,
          event.created_at
        );
        // notify user about created note
        toggleHasNewNote(true);
      });
    }

    return () => {
      if (sub.current) {
        sub.current.stop();
      }
    };
  }, [status]);
}
