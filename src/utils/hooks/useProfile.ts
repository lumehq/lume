import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

export function useProfile(pubkey: string, embed?: string) {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const {
    status,
    data: user,
    error,
  } = useQuery(
    ['user', pubkey],
    async () => {
      if (embed) {
        const profile: NDKUserProfile = JSON.parse(embed);
        return profile;
      }

      const cleanPubkey = pubkey.replace('-', '');
      const user = ndk.getUser({ hexpubkey: cleanPubkey });

      const profile = await user.fetchProfile({ closeOnEose: true });
      if (!user.profile) return Promise.reject(new Error('profile not found'));

      await db.createProfile(cleanPubkey, profile);

      return user.profile;
    },
    {
      enabled: !!ndk,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  return { status, user, error };
}
