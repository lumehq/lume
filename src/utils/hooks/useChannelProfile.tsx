import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { getChannel } from '@lume/utils/storage';

import { useContext } from 'react';
import useSWR from 'swr';
import useSWRSubscription from 'swr/subscription';

const fetcher = async ([, id]) => {
  const result = await getChannel(id);
  if (result) {
    return JSON.parse(result.metadata);
  } else {
    return null;
  }
};

export const useChannelProfile = (id: string, channelPubkey: string) => {
  const pool: any = useContext(RelayContext);

  const { data: cache, isLoading } = useSWR(['channel-cache-profile', id], fetcher);
  const { data, error } = useSWRSubscription(
    !isLoading && cache ? ['channel-profile', id] : null,
    ([, key], { next }) => {
      // subscribe to channel
      const unsubscribe = pool.subscribe(
        [
          {
            '#e': [key],
            authors: [channelPubkey],
            kinds: [41],
          },
        ],
        READONLY_RELAYS,
        (event: { content: string }) => {
          next(null, JSON.parse(event.content));
        },
        undefined,
        undefined,
        {
          unsubscribeOnEose: true,
        }
      );

      return () => {
        unsubscribe();
      };
    }
  );

  if (!data || error) {
    return cache;
  } else {
    return data;
  }
};
