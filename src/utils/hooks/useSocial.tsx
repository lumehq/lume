import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useNDK } from '@libs/ndk/provider';
import { createNote } from '@libs/storage';

import { nHoursAgo } from '@utils/date';
import { useAccount } from '@utils/hooks/useAccount';
import { usePublish } from '@utils/hooks/usePublish';
import { nip02ToArray } from '@utils/transform';

export function useSocial() {
  const queryClient = useQueryClient();

  const { publish } = usePublish();
  const { fetcher, relayUrls } = useNDK();
  const { account } = useAccount();
  const { status, data: userFollows } = useQuery(
    ['userFollows', account.pubkey],
    async () => {
      const res = await fetcher.fetchLastEvent(relayUrls, {
        kinds: [3],
        authors: [account.pubkey],
      });
      const list = nip02ToArray(res.tags);
      return list;
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
    const events = await fetcher.fetchAllEvents(
      relayUrls,
      { authors: [pubkey], kinds: [1, 6] },
      { since: nHoursAgo(48) }
    );

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
