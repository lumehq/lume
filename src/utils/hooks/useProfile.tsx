import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { createMetadata } from '@libs/storage';

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
        const user = await ndk.getUser({ hexpubkey: pubkey });
        await user.fetchProfile();
        if (user.profile) {
          user.profile.display_name = user.profile.displayName;
          await createMetadata(user.npub, pubkey, JSON.stringify(user.profile));
          return user.profile;
        } else {
          throw new Error('User not found');
        }
      } else {
        const profile = JSON.parse(fallback);
        return profile;
      }
    },
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, user, error, isFetching };
}
