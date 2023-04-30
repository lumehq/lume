import NoteLike from '@lume/app/newsfeed/components/metadata/like';
import NoteReply from '@lume/app/newsfeed/components/metadata/reply';
import NoteRepost from '@lume/app/newsfeed/components/metadata/repost';
import ZapIcon from '@lume/shared/icons/zap';
import { RelayContext } from '@lume/shared/relayProvider';
import { READONLY_RELAYS } from '@lume/stores/constants';

import { useSignal } from '@preact/signals-react';
import { useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

export default function NoteMetadata({ id, eventPubkey }: { id: string; eventPubkey: string }) {
  const pool: any = useContext(RelayContext);

  const replies = useSignal(0);
  const likes = useSignal(0);
  const reposts = useSignal(0);

  useSWRSubscription(id ? ['note-metadata', id] : null, ([, key], {}) => {
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [key],
          since: 0,
          kinds: [1, 6, 7],
          limit: 20,
        },
      ],
      READONLY_RELAYS,
      (event: any) => {
        switch (event.kind) {
          case 1:
            replies.value++;
            break;
          case 6:
            reposts.value++;
            break;
          case 7:
            if (event.content === '🤙' || event.content === '+') {
              likes.value++;
            }
            break;
          default:
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
  });

  return (
    <div className="flex items-center gap-16">
      <NoteReply id={id} replies={replies.value} />
      <NoteLike id={id} pubkey={eventPubkey} likes={likes.value} />
      <NoteRepost id={id} pubkey={eventPubkey} reposts={reposts.value} />
      <button className="group inline-flex w-min items-center gap-1.5">
        <ZapIcon width={20} height={20} className="text-zinc-400 group-hover:text-orange-400" />
        <span className="text-sm leading-none text-zinc-400 group-hover:text-zinc-200">{0}</span>
      </button>
    </div>
  );
}
