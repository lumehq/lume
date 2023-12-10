import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';

import { useArk } from '@libs/ark';

export function useProfile(pubkey: string, embed?: string) {
  const { ark } = useArk();
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

        // get clean pubkey without any special characters
        let hexstring = pubkey.replace(/[^a-zA-Z0-9]/g, '');

        if (hexstring.startsWith('npub1') || hexstring.startsWith('nprofile1')) {
          const decoded = nip19.decode(hexstring);
          if (decoded.type === 'nprofile') hexstring = decoded.data.pubkey;
          if (decoded.type === 'npub') hexstring = decoded.data;
        }

        const profile = await ark.getUserProfile({ pubkey: hexstring });

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
