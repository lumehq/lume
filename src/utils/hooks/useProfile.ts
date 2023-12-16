import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useArk } from '@libs/ark';

export function useProfile(pubkey: string, embed?: string) {
  const ark = useArk();
  const {
    isLoading,
    isError,
    data: user,
  } = useQuery({
    queryKey: ['user', pubkey],
    queryFn: async () => {
      try {
        // parse data from nostr.band api
        if (embed) {
          const profile: NDKUserProfile = JSON.parse(embed);
          return profile;
        }

        const profile = await ark.getUserProfile({ pubkey });

        if (!profile)
          throw new Error(
            `Cannot get metadata for ${pubkey}, will be retry after 10 seconds`
          );

        return profile;
      } catch (e) {
        throw new Error(e);
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  return { isLoading, isError, user };
}
