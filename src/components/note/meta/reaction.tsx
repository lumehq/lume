import { RelayContext } from '@components/relaysProvider';

import { dateToUnix } from '@utils/getDate';

import useLocalStorage from '@rehooks/local-storage';
import { Heart } from 'iconoir-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext, useEffect, useState } from 'react';

export const NoteReaction = ({
  count,
  liked,
  eventID,
  eventPubkey,
}: {
  count: number;
  liked: boolean;
  eventID: string;
  eventPubkey: string;
}) => {
  const [pool, relays]: any = useContext(RelayContext);
  const [activeAccount]: any = useLocalStorage('account', {});

  const [isReact, setIsReact] = useState(false);
  const [like, setLike] = useState(0);

  const handleLike = (e: any) => {
    e.stopPropagation();

    if (liked === false || isReact === false) {
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
      setLike((like) => (like += 1));
    }
  };

  useEffect(() => {
    setIsReact(liked);
    setLike(count);
  }, [count, liked]);

  return (
    <button onClick={(e) => handleLike(e)} className="group flex w-16 items-center gap-1 text-sm text-zinc-500">
      <div className="rounded-md p-1 group-hover:bg-zinc-800">
        {isReact ? (
          <Heart width={20} height={20} className="fill-red-500 text-transparent" />
        ) : (
          <Heart width={20} height={20} className="text-zinc-500" />
        )}
      </div>
      <span>{like}</span>
    </button>
  );
};
