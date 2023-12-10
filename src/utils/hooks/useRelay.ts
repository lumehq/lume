import { NDKKind, NDKRelayUrl, NDKTag } from '@nostr-dev-kit/ndk';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useArk } from '@libs/ark';

export function useRelay() {
  const { ark } = useArk();
  const queryClient = useQueryClient();

  const connectRelay = useMutation({
    mutationFn: async (relay: NDKRelayUrl, purpose?: 'read' | 'write' | undefined) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['relays', ark.account.pubkey] });

      // Snapshot the previous value
      const prevRelays: NDKTag[] = queryClient.getQueryData([
        'relays',
        ark.account.pubkey,
      ]);

      // create new relay list if not exist
      if (!prevRelays) {
        await ark.createEvent({
          kind: NDKKind.RelayList,
          tags: [['r', relay, purpose ?? '']],
          publish: true,
        });
      }

      // add relay to exist list
      const index = prevRelays.findIndex((el) => el[1] === relay);
      if (index > -1) return;

      await ark.createEvent({
        kind: NDKKind.RelayList,
        tags: [...prevRelays, ['r', relay, purpose ?? '']],
        publish: true,
      });

      // Optimistically update to the new value
      queryClient.setQueryData(['relays', ark.account.pubkey], (prev: NDKTag[]) => [
        ...prev,
        ['r', relay, purpose ?? ''],
      ]);

      // Return a context object with the snapshotted value
      return { prevRelays };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['relays', ark.account.pubkey] });
    },
  });

  const removeRelay = useMutation({
    mutationFn: async (relay: NDKRelayUrl) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['relays', ark.account.pubkey] });

      // Snapshot the previous value
      const prevRelays: NDKTag[] = queryClient.getQueryData([
        'relays',
        ark.account.pubkey,
      ]);

      if (!prevRelays) return;

      const index = prevRelays.findIndex((el) => el[1] === relay);
      if (index > -1) prevRelays.splice(index, 1);

      await ark.createEvent({
        kind: NDKKind.RelayList,
        tags: prevRelays,
        publish: true,
      });

      // Optimistically update to the new value
      queryClient.setQueryData(['relays', ark.account.pubkey], prevRelays);

      // Return a context object with the snapshotted value
      return { prevRelays };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['relays', ark.account.pubkey] });
    },
  });

  return { connectRelay, removeRelay };
}
