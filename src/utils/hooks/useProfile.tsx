import { NDKFilter } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { createMetadata, getUserMetadata } from '@libs/storage';

export function useProfile(pubkey: string, fallback?: string) {
  const { ndk } = useNDK();
  const {
    status,
    data: user,
    error,
    isFetching,
  } = useQuery(
    ['user', pubkey],
    async () => {
      if (!fallback) {
        const current = Math.floor(Date.now() / 1000);
        const cache = await getUserMetadata(pubkey);
        if (cache && parseInt(cache.created_at) + 86400 >= current) {
          return JSON.parse(cache.content);
        } else {
          const filter: NDKFilter = { kinds: [0], authors: [pubkey] };
          const events = await ndk.fetchEvents(filter);
          const latest = [...events].sort((a, b) => b.created_at - a.created_at).pop();
          if (latest) {
            await createMetadata(latest.id, latest.pubkey, latest.content);
            return JSON.parse(latest.content);
          } else {
            throw new Error('User not found');
          }
        }
      } else {
        const profile = JSON.parse(fallback);
        return profile;
      }
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, user, error, isFetching };
}
