import { RelayContext } from '@shared/relayProvider';

import { READONLY_RELAYS } from '@stores/constants';

import { getChannel, updateChannelMetadata } from '@utils/storage';

import { useContext } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRSubscription from 'swr/subscription';

const fetcher = async ([, id]) => {
  const result = await getChannel(id);
  if (result) {
    return JSON.parse(result.metadata);
  } else {
    return null;
  }
};

export function useChannelProfile(id: string, channelPubkey: string) {
  const pool: any = useContext(RelayContext);

  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR(['channel-metadata', id], fetcher);

  useSWRSubscription(!isLoading && data ? ['channel-metadata', id] : null, ([, key], {}) => {
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
        // update in local database
        updateChannelMetadata(key, event.content);
        // revaildate
        mutate(['channel-metadata', key]);
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
  });

  return data;
}
