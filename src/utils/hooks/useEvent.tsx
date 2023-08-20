import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { parser } from '@utils/parser';
import { RichContent } from '@utils/types';

export function useEvent(id: string, embed?: string) {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data, error } = useQuery(
    ['event', id],
    async () => {
      let richContent: RichContent;
      // return embed event (nostr.band api)
      if (embed) {
        const event: NDKEvent = JSON.parse(embed);
        if (event.kind === 1) richContent = parser(event);

        return { event: event, richContent: richContent };
      }

      // get event from db
      const dbEvent = await db.getEventByID(id);
      if (dbEvent) {
        if (dbEvent.kind === 1) richContent = parser(dbEvent);
        return { event: dbEvent, richContent: richContent };
      } else {
        // get event from relay if event in db not present
        const event = await ndk.fetchEvent(id);
        if (event.kind === 1) richContent = parser(event);

        return { event: event, richContent: richContent };
      }
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, data, error };
}
