import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';

import { getChannel, updateChannelMetadata } from '@libs/storage';

import { RelayContext } from '@shared/relayProvider';

export function useChannelProfile(id: string) {
  const ndk = useContext(RelayContext);
  const { data } = useQuery(['channel-metadata', id], async () => {
    return await getChannel(id);
  });

  useEffect(() => {
    // subscribe to channel
    const sub = ndk.subscribe(
      {
        '#e': [id],
        kinds: [41],
      },
      {
        closeOnEose: true,
      }
    );

    sub.addListener('event', (event: { content: string }) => {
      // update in local database
      updateChannelMetadata(id, event.content);
    });

    return () => {
      sub.stop();
    };
  }, []);

  return data;
}
