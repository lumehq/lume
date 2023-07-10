import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useNDK } from '@libs/ndk/provider';
import { getChannel, updateChannelMetadata } from '@libs/storage';

export function useChannelProfile(id: string) {
  const { ndk } = useNDK();
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
