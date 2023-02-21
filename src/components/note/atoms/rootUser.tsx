/* eslint-disable @typescript-eslint/no-explicit-any */
import { truncate } from '@utils/truncate';

import { useNostrEvents } from 'nostr-react';

export default function RootUser({ userPubkey, action }: { userPubkey: string; action: string }) {
  const { events } = useNostrEvents({
    filter: {
      authors: [userPubkey],
      kinds: [0],
    },
  });

  if (events !== undefined && events.length > 0) {
    const userData: any = JSON.parse(events[0].content);
    return (
      <div className="text-zinc-400">
        <p>
          {userData?.name ? userData.name : truncate(userPubkey, 16, ' .... ')} {action}
        </p>
      </div>
    );
  } else {
    return <></>;
  }
}
