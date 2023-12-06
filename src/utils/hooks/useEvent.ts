import { NDKEvent, NDKSubscriptionCacheUsage, NostrEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { AddressPointer } from 'nostr-tools/lib/types/nip19';

import { useNDK } from '@libs/ndk/provider';

export function useEvent(id: undefined | string, embed?: undefined | string) {
  const { ndk } = useNDK();
  const { status, isFetching, isError, data } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const naddr = id.startsWith('naddr')
        ? (nip19.decode(id).data as AddressPointer)
        : null;

      // return event refer from naddr
      if (naddr) {
        const rEvents = await ndk.fetchEvents({
          kinds: [naddr.kind],
          '#d': [naddr.identifier],
          authors: [naddr.pubkey],
        });

        const rEvent = [...rEvents].slice(-1)[0];

        if (!rEvent) throw new Error('event not found');
        return rEvent;
      }

      // return embed event (nostr.band api)
      if (embed) {
        const embedEvent: NostrEvent = JSON.parse(embed);
        const ndkEvent = new NDKEvent(ndk, embedEvent);

        return ndkEvent;
      }

      // get event from relay
      const event = await ndk.fetchEvent(id, {
        cacheUsage: NDKSubscriptionCacheUsage.CACHE_FIRST,
      });

      if (!event)
        throw new Error(`Cannot get event with ${id}, will be retry after 10 seconds`);

      return event;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  return { status, isFetching, isError, data };
}
