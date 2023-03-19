import { RelayContext } from '@components/contexts/relay';
import { CommentsCounter } from '@components/note/counter/comments';
import { LikesCounter } from '@components/note/counter/likes';

import { useLocalStorage } from '@rehooks/local-storage';
import { useContext, useMemo, useState } from 'react';

export default function NoteMetadata({ eventID, eventPubkey }: { eventID: string; eventPubkey: string }) {
  const relayPool: any = useContext(RelayContext);
  const [relays]: any = useLocalStorage('relays');

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  useMemo(() => {
    relayPool.subscribe(
      [
        {
          '#e': [eventID],
          since: 0,
          kinds: [1, 7],
        },
      ],
      relays,
      (event: any) => {
        switch (event.kind) {
          case 1:
            setComments((comments) => (comments += 1));
            break;
          case 7:
            if (event.content === '🤙' || event.content === '+') {
              setLikes((likes) => (likes += 1));
            }
            break;
          default:
            break;
        }
      },
      undefined,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );
  }, [eventID, relayPool, relays]);

  return (
    <div className="relative z-10 -ml-1 flex items-center gap-8">
      <CommentsCounter comments={comments} />
      <LikesCounter likes={likes} eventID={eventID} eventPubkey={eventPubkey} />
    </div>
  );
}
