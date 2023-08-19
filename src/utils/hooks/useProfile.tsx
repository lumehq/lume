import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';

export function useProfile(pubkey: string, embed?: string) {
  const { ndk } = useNDK();
  const {
    status,
    data: user,
    error,
  } = useQuery(
    ['user', pubkey],
    async () => {
      if (!embed) {
        const cleanPubkey = pubkey.replace('-', '');
        const user = ndk.getUser({ hexpubkey: cleanPubkey });
        await user.fetchProfile();
        if (user.profile) {
          user.profile.display_name = user.profile.displayName;
          return user.profile;
        } else {
          throw new Error('User not found');
        }
      } else {
        const profile: NDKUserProfile = JSON.parse(embed);
        return profile;
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

  return { status, user, error };
}
