import { RelayContext } from '@components/contexts/relay';

import { dateToUnix } from '@utils/getDate';

import LikeIcon from '@assets/icons/like';
import LikedIcon from '@assets/icons/liked';

import { useLocalStorage } from '@rehooks/local-storage';
import { getEventHash, signEvent } from 'nostr-tools';
import { memo, useCallback, useContext, useState } from 'react';

export const LikesCounter = memo(function LikesCounter({
  count,
  eventID,
  eventPubkey,
}: {
  count: number;
  eventID: string;
  eventPubkey: string;
}) {
  const relayPool: any = useContext(RelayContext);

  const [relays]: any = useLocalStorage('relays');
  const [currentUser]: any = useLocalStorage('current-user');

  const [isReact, setIsReact] = useState(false);
  const [like, setLike] = useState(count);

  const handleLike = useCallback(
    (e: any) => {
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
      // update counter
      setLike(like + 1);
    },
    [eventID, eventPubkey, currentUser.id, currentUser.privkey, relayPool, relays, like]
  );

  return (
    <button onClick={(e) => handleLike(e)} className="group flex w-16 items-center gap-1 text-sm text-zinc-500">
      <div className="rounded-md p-1 group-hover:bg-zinc-800">
        {isReact ? <LikedIcon className="h-5 w-5 text-red-500" /> : <LikeIcon className="h-5 w-5 text-zinc-500" />}
      </div>
      <span>{like}</span>
    </button>
  );
});
