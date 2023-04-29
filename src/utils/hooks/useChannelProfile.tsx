import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';

import { useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

export const useChannelProfile = (id: string, channelPubkey: string) => {
  const pool: any = useContext(RelayContext);

  const { data } = useSWRSubscription(id ? id : null, (key, { next }) => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [41],
          '#e': [key],
        },
        {
          ids: [key],
          kinds: [40],
        },
      ],
      READONLY_RELAYS,
      (event: { kind: number; pubkey: string; content: string }) => {
        switch (event.kind) {
          case 40:
            next(null, JSON.parse(event.content));
            break;
          case 41:
            console.log(event);
            if (event.pubkey === channelPubkey) {
              next(null, JSON.parse(event.content));
            }
            break;
          default:
            break;
        }
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
};
