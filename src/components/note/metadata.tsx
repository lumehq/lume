import { NoteComment } from '@components/note/meta/comment';
import { NoteReaction } from '@components/note/meta/reaction';
import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { useAtomValue } from 'jotai';
import { useContext, useEffect, useState } from 'react';

export default function NoteMetadata({
  eventID,
  eventPubkey,
  eventContent,
  eventTime,
}: {
  eventID: string;
  eventPubkey: string;
  eventTime: string;
  eventContent: any;
}) {
  const pool: any = useContext(RelayContext);
  const relays = useAtomValue(relaysAtom);

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    const unsubscribe = pool.subscribe(
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

    return () => {
      unsubscribe();
    };
  }, [eventID, pool, relays]);

  return (
    <div className="relative z-10 -ml-1 flex items-center gap-8">
      <NoteComment
        count={comments}
        eventID={eventID}
        eventPubkey={eventPubkey}
        eventContent={eventContent}
        eventTime={eventTime}
      />
      <NoteReaction count={likes} eventID={eventID} eventPubkey={eventPubkey} />
    </div>
  );
}
