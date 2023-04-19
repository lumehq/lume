import { RelayContext } from '@components/relaysProvider';

import { updateChannelMetadata } from '@utils/storage';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export const useChannelMetadata = (id: string, fallback: string) => {
  const [pool, relays]: any = useContext(RelayContext);
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
      relays,
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
  }, []);

  useEffect(() => {
    if (typeof fallback === 'object') {
      setMetadata(fallback);
    } else {
      const json = JSON.parse(fallback);
      setMetadata(json);
    }

    // fetch kind 41
    fetchMetadata();

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [fetchMetadata]);

  return metadata;
};
