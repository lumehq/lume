import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { createNote, getNoteByID } from '@libs/storage';

import { parser } from '@utils/parser';

export function useEvent(id: string, fallback?: string) {
  const { ndk } = useNDK();
  const { status, data, error, isFetching } = useQuery(
    ['note', id],
    async () => {
      const result = await getNoteByID(id);
      if (result) {
        if (result.kind === 1) {
          result['content'] = parser(result);
        }
        return result;
      } else {
        if (fallback) {
          const embed = JSON.parse(fallback);
          await createNote(
            embed.id,
            embed.pubkey,
            embed.kind,
            embed.tags,
            embed.content,
            embed.created_at
          );
          return embed;
        } else {
          const event = await ndk.fetchEvent(id);
          if (event) {
            await createNote(
              event.id,
              event.pubkey,
              event.kind,
              event.tags,
              event.content,
              event.created_at
            );
            event['event_id'] = event.id;
            if (event.kind === 1) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              event['content'] = parser(event);
            }
            return event;
          } else {
            return null;
          }
        }
      }
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );

  return { status, data, error, isFetching };
}
