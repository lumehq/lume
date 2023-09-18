import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { AddressPointer } from 'nostr-tools/lib/nip19';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { toRawEvent } from '@utils/rawEvent';

export function useEvent(
  id: undefined | string,
  naddr?: undefined | AddressPointer,
  embed?: undefined | string
) {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    ['event', id],
    async () => {
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

      // get event from db
      const dbEvent = await db.getEventByID(id);
      if (dbEvent) return dbEvent;

      // get event from relay if event in db not present
      const event = await ndk.fetchEvent(id);
      if (!event) return Promise.reject(new Error('event not found'));

      const rawEvent = toRawEvent(event);
      await db.createEvent(rawEvent);

      return event;
    },
    {
      enabled: !!ndk,
      refetchOnWindowFocus: false,
    }
  );

  return { status, data };
}
