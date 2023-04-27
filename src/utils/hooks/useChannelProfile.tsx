import { RelayContext } from '@components/relaysProvider';

import { READONLY_RELAYS } from '@stores/constants';

import { useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

export const useChannelProfile = (id: string, channelPubkey: string) => {
  const pool: any = useContext(RelayContext);

  const { data } = useSWRSubscription(
    id
      ? [
          {
            kinds: [41],
            '#e': [id],
          },
          {
            ids: [id],
            kinds: [40],
          },
        ]
      : null,
    (key, { next }) => {
      const unsubscribe = pool.subscribe(
        key,
        READONLY_RELAYS,
        (event: { kind: number; pubkey: string; content: string }) => {
          switch (event.kind) {
            case 40:
              next(null, JSON.parse(event.content));
              break;
            case 41:
              if (event.pubkey === channelPubkey) {
                next(null, JSON.parse(event.content));
              }
            default:
              break;
          }
        },
        undefined,
        undefined,
        {
          unsubscribeOnEose: true,
          logAllEvents: false,
        }
      );

      return () => {
        unsubscribe();
      };
    }
  );

  return data;
};
