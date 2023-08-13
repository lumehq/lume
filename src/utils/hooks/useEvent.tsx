import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { createNote, getNoteByID } from '@libs/storage';

import { parser } from '@utils/parser';
import { LumeEvent } from '@utils/types';

export function useEvent(id: string, fallback?: string) {
  const { ndk } = useNDK();
  const { status, data, error, isFetching } = useQuery(
    ['note', id],
    async () => {
      const result = await getNoteByID(id);
      if (result) {
        return result as LumeEvent;
      } else {
        if (fallback) {
          const embed: LumeEvent = JSON.parse(fallback);
          if (embed.kind === 1) embed['content'] = parser(embed);
          embed['event_id'] = embed.id;
          await createNote(
            embed.id,
            embed.pubkey,
            embed.kind,
            embed.tags,
            embed.content as unknown as string,
            embed.created_at
          );
          return embed;
        } else {
          const event = (await ndk.fetchEvent(id)) as unknown as LumeEvent;
          if (event) {
            await createNote(
              event.id,
              event.pubkey,
              event.kind,
              event.tags,
              event.content as unknown as string,
              event.created_at
            );
            event['event_id'] = event.id;
            if (event.kind === 1) event['content'] = parser(event);
            return event as unknown as LumeEvent;
          } else {
            throw new Error('Event not found');
          }
        }
      }
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, data, error, isFetching };
}
