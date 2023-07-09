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
        return cache;
      } else {
        const user = ndk.getUser({ hexpubkey: pubkey });
        await user.fetchProfile();
        await createMetadata(pubkey, pubkey, JSON.stringify(user.profile));
        return user.profile;
      }
    } else {
      const profile = JSON.parse(fallback);
      return profile;
    }
  });

  return { status, user, error, isFetching };
}
