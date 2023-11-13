import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { AddressPointer } from 'nostr-tools/lib/types/nip19';

import { useNDK } from '@libs/ndk/provider';

export function useEvent(id: undefined | string, embed?: undefined | string) {
  const { ndk } = useNDK();
  const { status, data } = useQuery({
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
        if (!rEvent) return Promise.reject(new Error('event not found'));

        return rEvent;
      }

      // return embed event (nostr.band api)
      if (embed) {
        const event: NDKEvent = JSON.parse(embed);
        return event;
      }

      // get event from relay
      const event = await ndk.fetchEvent(id);
      if (!event) return Promise.reject(new Error('event not found'));

      return event;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  return { status, data };
}
