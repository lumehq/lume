/* eslint-disable @typescript-eslint/no-explicit-any */
import { truncate } from '@utils/truncate';

import { useNostrEvents } from 'nostr-react';
import { memo, useState } from 'react';

export const UserRepost = memo(function UserRepost({ pubkey }: { pubkey: string }) {
  const [profile, setProfile] = useState({ picture: null, name: null });

  const { onEvent } = useNostrEvents({
    filter: {
      authors: [pubkey],
      kinds: [0],
    },
  });

  // #TODO: save response to DB
  onEvent((rawMetadata) => {
    try {
      const metadata: any = JSON.parse(rawMetadata.content);
      if (metadata) {
        setProfile(metadata);
      }
    } catch (err) {
      console.error(err, rawMetadata);
    }
  });

  return (
    <div className="text-zinc-400">
      <p>{profile.name ? profile.name : truncate(pubkey, 16, ' .... ')} repost</p>
    </div>
  );
});
