import { RelayContext } from '@components/relaysProvider';

import { DEFAULT_RELAYS } from '@stores/constants';

import { updateChannelMetadata } from '@utils/storage';

import { useCallback, useContext, useEffect, useState } from 'react';

export const useChannelMetadata = (id: string, fallback: string) => {
  const pool: any = useContext(RelayContext);
  const [metadata, setMetadata] = useState(fallback);

  const fetchMetadata = useCallback(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [41],
          '#e': [id],
        },
      ],
      DEFAULT_RELAYS,
      (event: { content: string }) => {
        const json = JSON.parse(event.content);
        // update state
        setMetadata(json);
        // update metadata in database
        updateChannelMetadata(id, event.content);
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
  }, [id, pool]);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      // fetch kind 41
      fetchMetadata();
    }

    return () => {
      ignore = true;
    };
  }, [fetchMetadata, fallback]);

  return metadata;
};
