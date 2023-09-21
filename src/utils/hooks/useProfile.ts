import { NDKKind, NDKUserProfile } from '@nostr-dev-kit/ndk';
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
      if (!embed) {
        const cleanPubkey = pubkey.replace('-', '');
        const dbEvent = await db.getMetadataByPubkey(cleanPubkey);
        if (dbEvent) {
          return JSON.parse(dbEvent.content) as NDKUserProfile;
        }

        const events = await ndk.fetchEvents(
          {
            kinds: [NDKKind.Metadata],
            authors: [cleanPubkey],
            limit: 1,
          },
          { closeOnEose: true }
        );
        if (!events) throw new Error(`User not found: ${pubkey}`);
        const latestEvent = [...events].sort((a, b) => b.created_at - a.created_at)[0];
        await db.createMetadata(latestEvent);

        return JSON.parse(latestEvent.content) as NDKUserProfile;
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
