import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { createNote } from '@libs/storage';

import { nHoursAgo } from '@utils/date';
import { useAccount } from '@utils/hooks/useAccount';
import { useNostr } from '@utils/hooks/useNostr';

export function useSocial() {
  const queryClient = useQueryClient();

  const { publish } = useNostr();
  const { ndk } = useNDK();
  const { account } = useAccount();
  const { status, data: userFollows } = useQuery(
    ['userFollows', account.pubkey],
    async () => {
      const keys = [];
      const user = ndk.getUser({ hexpubkey: account.pubkey });
      const follows = await user.follows();

      follows.forEach((item) => {
        keys.push(item.hexpubkey);
      });

      return keys;
    },
    {
      enabled: account ? true : false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const unfollow = (pubkey: string) => {
    const followsAsSet = new Set(userFollows);
    followsAsSet.delete(pubkey);

    const tags = [];
    followsAsSet.forEach((item) => {
      tags.push(['p', item]);
    });

    // publish event
    publish({ content: '', kind: 3, tags: tags });
    // invalid cache
    queryClient.invalidateQueries({
      queryKey: ['userFollows', account.pubkey],
    });
  };

  const follow = async (pubkey: string) => {
    const followsAsSet = new Set(userFollows);
    followsAsSet.add(pubkey);

    const tags = [];
    followsAsSet.forEach((item) => {
      tags.push(['p', item]);
    });

    // publish event
    publish({ content: '', kind: 3, tags: tags });
    // invalid cache
    queryClient.invalidateQueries({
      queryKey: ['userFollows', account.pubkey],
    });

    // fetch events
    const events = await ndk.fetchEvents({
      authors: [pubkey],
      kinds: [1, 6],
      since: nHoursAgo(24),
    });

    for (const event of events) {
      await createNote(
        event.id,
        event.pubkey,
        event.kind,
        event.tags,
        event.content,
        event.created_at
      );
    }
  };

  return { status, userFollows, follow, unfollow };
}
