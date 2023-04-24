import { RelayContext } from '@components/relaysProvider';

import { DEFAULT_RELAYS } from '@stores/constants';

import { updateChannelMetadata } from '@utils/storage';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export const useChannelMetadata = (id: string, fallback: string) => {
  const pool: any = useContext(RelayContext);
  const [metadata, setMetadata] = useState(null);
  const unsubscribe = useRef(null);

  const fetchMetadata = useCallback(() => {
    unsubscribe.current = pool.subscribe(
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
  }, [id, pool]);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      if (typeof fallback === 'object') {
        setMetadata(fallback);
      } else {
        const json = JSON.parse(fallback);
        setMetadata(json);
      }

      // fetch kind 41
      fetchMetadata();
    }

    return () => {
      ignore = true;
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [fetchMetadata, fallback]);

  return metadata;
};
