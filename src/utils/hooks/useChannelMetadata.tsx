import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { updateChannelMetadata } from '@lume/utils/storage';
import { getChannel } from '@lume/utils/storage';

import { useCallback, useContext, useEffect, useState } from 'react';

export const useChannelMetadata = (id: string, channelPubkey: string) => {
  const pool: any = useContext(RelayContext);
  const [metadata, setMetadata] = useState(null);

  const fetchFromRelay = useCallback(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [41],
          '#e': [id],
        },
        {
          ids: [id],
          kinds: [40],
        },
      ],
      READONLY_RELAYS,
      (event: { kind: number; pubkey: string; content: string }) => {
        switch (event.kind) {
          case 41:
            if (event.pubkey === channelPubkey) {
              const json = JSON.parse(event.content);
              // update state
              setMetadata(json);
              // update metadata in database
              updateChannelMetadata(id, event.content);
            }
            break;
          case 40:
            if (event.pubkey === channelPubkey) {
              // update state
              setMetadata(JSON.parse(event.content));
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
  }, [channelPubkey, id]);

  const getChannelFromDB = useCallback(async () => {
    return await getChannel(id);
  }, [id]);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getChannelFromDB().then((res) => {
        if (res) {
          setMetadata(JSON.parse(res.metadata));
        } else {
          fetchFromRelay();
        }
      });
    }

    return () => {
      ignore = true;
    };
  }, [fetchFromRelay, getChannelFromDB]);

  return metadata;
};
