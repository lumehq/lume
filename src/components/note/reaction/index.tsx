import { RelayContext } from '@components/contexts/relay';

import { dateToUnix } from '@utils/getDate';

import { useLocalStorage } from '@rehooks/local-storage';
import { getEventHash, signEvent } from 'nostr-tools';
import { memo, useContext, useEffect, useState } from 'react';

export const Reaction = memo(function Reaction({ eventID, eventPubkey }: { eventID: string; eventPubkey: string }) {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');

  const [reaction, setReaction] = useState(0);
  const [isReact, setIsReact] = useState(false);

  const [currentUser]: any = useLocalStorage('current-user');

  const handleReaction = (e: any) => {
    e.stopPropagation();

    const event: any = {
      content: '+',
      kind: 7,
      tags: [
        ['e', eventID],
        ['p', eventPubkey],
      ],
      created_at: dateToUnix(),
      pubkey: currentUser.id,
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, currentUser.privkey);
    // publish event to all relays
    relayPool.publish(event, relays);
    // update state to change icon to filled heart
    setIsReact(true);
    // update reaction count
    setReaction(reaction + 1);
  };

  useEffect(() => {
    relayPool.subscribe(
      [
        {
          '#e': [eventID],
          since: 0,
          kinds: [7],
          limit: 10,
        },
      ],
      relays,
      (event: any) => {
        if (event.content === '🤙' || event.content === '+') {
          setReaction(reaction + 1);
        }
      },
      undefined,
      (events: any, relayURL: any) => {
        console.log(events, relayURL);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventID, relayPool, relays]);

  return (
    <button onClick={(e) => handleReaction(e)} className="group flex w-16 items-center gap-1.5 text-sm text-zinc-500">
      <div className="rounded-md p-1 group-hover:bg-zinc-800">
        {isReact ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-red-500"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        ) : (
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
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        )}
      </div>
      <span>{reaction}</span>
    </button>
  );
});
