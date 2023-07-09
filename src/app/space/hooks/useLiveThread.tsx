import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { createReplyNote } from '@libs/storage';

export function useLiveThread(id: string) {
  const queryClient = useQueryClient();
  const now = useRef(Math.floor(Date.now() / 1000));

  const { ndk } = useNDK();

  const thread = useMutation({
    mutationFn: (data: NDKEvent) => {
      return createReplyNote(
        id,
        data.id,
        data.pubkey,
        data.kind,
        data.tags,
        data.content,
        data.created_at
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies', id] });
    },
  });

  useEffect(() => {
    const filter: NDKFilter = {
      kinds: [1],
      '#e': [id],
      since: now.current,
    };

    const sub = ndk.subscribe(filter, { closeOnEose: false });

    sub.addListener('event', (event: NDKEvent) => {
      thread.mutate(event);
    });

    return () => {
      sub.stop();
    };
  }, []);
}
