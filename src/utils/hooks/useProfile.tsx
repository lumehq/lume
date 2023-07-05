import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { createMetadata, getUserMetadata } from '@libs/storage';

import { RelayContext } from '@shared/relayProvider';

export function useProfile(pubkey: string, fallback?: string) {
  const ndk = useContext(RelayContext);
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
          console.log('use cache', cache);
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
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, user, error, isFetching };
}
