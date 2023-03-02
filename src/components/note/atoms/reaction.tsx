/* eslint-disable @typescript-eslint/no-explicit-any */
import { RelayContext } from '@components/contexts/relay';

import { dateToUnix } from '@utils/getDate';

import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import { useLocalStorage } from '@rehooks/local-storage';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext, useState } from 'react';

export default function Reaction({ eventID, eventPubkey }: { eventID: string; eventPubkey: string }) {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');

  const [reaction, setReaction] = useState(0);
  const [isReact, setIsReact] = useState(false);

  const [currentUser]: any = useLocalStorage('current-user');
  const pubkey = currentUser.pubkey;
  const privkey = currentUser.privkey;

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
        //setReaction(reaction + 1);
      }
    },
    undefined,
    (events: any, relayURL: any) => {
      console.log(events, relayURL);
    }
  );

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
      pubkey: pubkey,
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privkey);

    relayPool.publish(event, relays);

    setIsReact(true);
    setReaction(reaction + 1);
  };

  return (
    <button onClick={(e) => handleReaction(e)} className="group flex w-16 items-center gap-1.5 text-sm text-zinc-500">
      <div className="rounded-lg p-1 group-hover:bg-zinc-600">
        {isReact ? <HeartFilledIcon className="h-4 w-4 group-hover:text-red-400" /> : <HeartIcon className="h-4 w-4 text-zinc-500" />}
      </div>
      <span>{reaction}</span>
    </button>
  );
}
