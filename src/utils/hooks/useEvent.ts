import { NDKEvent, NostrEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';
import { AddressPointer } from 'nostr-tools/lib/types/nip19';

import { useArk } from '@libs/ark';

export function useEvent(id: undefined | string, embed?: undefined | string) {
  const { ark } = useArk();
  const { status, isFetching, isError, data } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      let event: NDKEvent = undefined;

      const naddr = id.startsWith('naddr')
        ? (nip19.decode(id).data as AddressPointer)
        : null;

      // return event refer from naddr
      if (naddr) {
        const events = await ark.getAllEvents({
          filter: {
            kinds: [naddr.kind],
            '#d': [naddr.identifier],
            authors: [naddr.pubkey],
          },
        });
        event = events.slice(-1)[0];
      }

      // return embed event (nostr.band api)
      if (embed) {
        const embedEvent: NostrEvent = JSON.parse(embed);
        event = ark.createNDKEvent({ event: embedEvent });
      }

      // get event from relay
      event = await ark.getEventById({ id });

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
