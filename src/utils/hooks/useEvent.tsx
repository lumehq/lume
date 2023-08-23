import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

export function useEvent(id: string, embed?: string) {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data } = useQuery(
    ['event', id],
    async () => {
      // return embed event (nostr.band api)
      if (embed) {
        const event: NDKEvent = JSON.parse(embed);
        return event;
      }
      // get event from db
      const dbEvent = await db.getEventByID(id);
      if (dbEvent) {
        return dbEvent;
      } else {
        // get event from relay if event in db not present
        const event = await ndk.fetchEvent(id);
        if (!event) throw new Error(`Event not found: ${id}`);
        return event;
      }
    },
    {
      enabled: !!ndk,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, data };
}
