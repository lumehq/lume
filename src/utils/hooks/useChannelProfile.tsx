import { FULL_RELAYS } from '@lume/stores/constants';

import { RelayPool } from 'nostr-relaypool';
import useSWRSubscription from 'swr/subscription';

export const useChannelProfile = (id: string, channelPubkey: string) => {
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
      const pool = new RelayPool(FULL_RELAYS);
      const unsubscribe = pool.subscribe(
        key,
        FULL_RELAYS,
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
        }
      );

      return () => {
        unsubscribe();
      };
    }
  );

  return data;
};
