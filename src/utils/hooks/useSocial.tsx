import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { useNostr } from '@utils/hooks/useNostr';

export function useSocial() {
  const queryClient = useQueryClient();

  const { publish } = useNostr();
  const { ndk } = useNDK();
  const { db } = useStorage();
  const { status, data: userFollows } = useQuery(
    ['userFollows', db.account.pubkey],
    async () => {
      const keys = [];
      const user = ndk.getUser({ hexpubkey: db.account.pubkey });
      const follows = await user.follows();

      follows.forEach((item) => {
        keys.push(item.hexpubkey);
      });

      return keys;
    },
    {
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
      queryKey: ['userFollows', db.account.pubkey],
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
      queryKey: ['userFollows', db.account.pubkey],
    });
  };

  return { status, userFollows, follow, unfollow };
}
