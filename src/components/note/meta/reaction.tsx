import { RelayContext } from '@components/relaysProvider';

import { dateToUnix } from '@utils/getDate';

import LikeIcon from '@assets/icons/like';
import LikedIcon from '@assets/icons/liked';

import useLocalStorage from '@rehooks/local-storage';
import { getEventHash, signEvent } from 'nostr-tools';
import { memo, useContext, useEffect, useState } from 'react';

export const NoteReaction = memo(function NoteReaction({
  count,
  eventID,
  eventPubkey,
}: {
  count: number;
  eventID: string;
  eventPubkey: string;
}) {
  const [pool, relays]: any = useContext(RelayContext);

  const [activeAccount]: any = useLocalStorage('activeAccount', {});
  const [isReact, setIsReact] = useState(false);
  const [like, setLike] = useState(0);

  const handleLike = (e: any) => {
    e.stopPropagation();

    const event: any = {
      content: '+',
      kind: 7,
      tags: [
        ['e', eventID],
        ['p', eventPubkey],
      ],
      created_at: dateToUnix(),
      pubkey: activeAccount.pubkey,
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);
    // publish event to all relays
    pool.publish(event, relays);
    // update state to change icon to filled heart
    setIsReact(true);
    // update counter
    setLike(like + 1);
  };

  useEffect(() => {
    setLike(count);
  }, [count]);

  return (
    <button onClick={(e) => handleLike(e)} className="group flex w-16 items-center gap-1 text-sm text-zinc-500">
      <div className="rounded-md p-1 group-hover:bg-zinc-800">
        {isReact ? <LikedIcon className="h-5 w-5 text-red-500" /> : <LikeIcon className="h-5 w-5 text-zinc-500" />}
      </div>
      <span>{like}</span>
    </button>
  );
});
