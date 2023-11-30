import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { nip19 } from 'nostr-tools';

import { useNDK } from '@libs/ndk/provider';

export function useProfile(pubkey: string, embed?: string) {
  const queryClient = useQueryClient();
  const { ndk } = useNDK();
  const {
    status,
    data: user,
    error,
  } = useQuery({
    queryKey: ['user', pubkey],
    queryFn: async () => {
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

      const user = ndk.getUser({ pubkey: hexstring });
      const profile = await user.fetchProfile();

      if (!profile)
        throw new Error(
          `Cannot get metadata for ${pubkey}, will be retry after 10 seconds`
        );
      return profile;
    },
    initialData: () => queryClient.getQueryData(['user', pubkey]),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

  return { status, user, error };
}
