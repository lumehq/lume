import { NDKEvent, NDKKind, NDKRelayUrl, NDKTag } from '@nostr-dev-kit/ndk';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

export function useRelay() {
  const { db } = useStorage();
  const { ndk } = useNDK();

  const queryClient = useQueryClient();

  const connectRelay = useMutation({
    mutationFn: async (relay: NDKRelayUrl, purpose?: 'read' | 'write' | undefined) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['relays', db.account.pubkey] });

      // Snapshot the previous value
      const prevRelays: NDKTag[] = queryClient.getQueryData([
        'relays',
        db.account.pubkey,
      ]);

      // create new relay list if not exist
      if (!prevRelays) {
        const newListEvent = new NDKEvent(ndk);
        newListEvent.kind = NDKKind.RelayList;
        newListEvent.tags = [['r', relay, purpose ?? '']];
        await newListEvent.publish();
      }

      // add relay to exist list
      const index = prevRelays.findIndex((el) => el[1] === relay);
      if (index > -1) return;

      const event = new NDKEvent(ndk);
      event.kind = NDKKind.RelayList;
      event.tags = [...prevRelays, ['r', relay, purpose ?? '']];

      await event.publish();

      // Optimistically update to the new value
      queryClient.setQueryData(['relays', db.account.pubkey], (prev: NDKTag[]) => [
        ...prev,
        ['r', relay, purpose ?? ''],
      ]);

      // Return a context object with the snapshotted value
      return { prevRelays };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['relays', db.account.pubkey] });
    },
  });

  const removeRelay = useMutation({
    mutationFn: async (relay: NDKRelayUrl) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['relays', db.account.pubkey] });

      // Snapshot the previous value
      const prevRelays: NDKTag[] = queryClient.getQueryData([
        'relays',
        db.account.pubkey,
      ]);

      if (!prevRelays) return;

      const index = prevRelays.findIndex((el) => el[1] === relay);
      if (index > -1) prevRelays.splice(index, 1);

      const event = new NDKEvent(ndk);
      event.kind = NDKKind.RelayList;
      event.tags = prevRelays;
      await event.publish();

      // Optimistically update to the new value
      queryClient.setQueryData(['relays', db.account.pubkey], prevRelays);

      // Return a context object with the snapshotted value
      return { prevRelays };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['relays', db.account.pubkey] });
    },
  });

  return { connectRelay, removeRelay };
}
