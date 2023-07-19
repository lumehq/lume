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
  } = useQuery(['user', pubkey], async () => {
    if (!fallback) {
      const current = Math.floor(Date.now() / 1000);
      const cache = await getUserMetadata(pubkey);
      if (cache && parseInt(cache.created_at) + 86400 >= current) {
        console.log('cache hit - ', cache);
        return cache;
      } else {
        const filter: NDKFilter = { kinds: [0], authors: [pubkey] };
        const events = await ndk.fetchEvents(filter);
        const latest = [...events].slice(-1)[0];
        if (latest) {
          await createMetadata(pubkey, pubkey, latest.content);
          return JSON.parse(latest.content);
        } else {
          return null;
        }
      }
    } else {
      const profile = JSON.parse(fallback);
      return profile;
    }
  });

  return { status, user, error, isFetching };
}
