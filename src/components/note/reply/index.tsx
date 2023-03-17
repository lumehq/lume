import { RelayContext } from '@components/contexts/relay';

import { useLocalStorage } from '@rehooks/local-storage';
import { memo, useContext, useEffect, useState } from 'react';

export const Reply = memo(function Reply({ eventID }: { eventID: string }) {
  const relayPool: any = useContext(RelayContext);

  const [relays]: any = useLocalStorage('relays');
  const [reply, setReply] = useState(0);

  useEffect(() => {
    relayPool.subscribe(
      [
        {
          '#e': [eventID],
          since: 0,
          kinds: [1],
          limit: 10,
        },
      ],
      relays,
      () => {
        setReply(reply + 1);
      },
      undefined,
      (events: any, relayURL: any) => {
        console.log(events, relayURL);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventID, relayPool, relays]);

  return (
    <div className="group flex w-16 items-center gap-1.5 text-sm text-zinc-500">
      <div className="rounded-md p-1 group-hover:bg-zinc-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-zinc-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          />
        </svg>
      </div>
      <span>{reply}</span>
    </div>
  );
});
