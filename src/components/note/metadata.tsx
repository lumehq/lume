import { NoteComment } from '@components/note/meta/comment';
import { NoteReaction } from '@components/note/meta/reaction';
import { RelayContext } from '@components/relaysProvider';

import { useContext, useEffect, useState } from 'react';

export default function NoteMetadata({
  eventID,
  eventPubkey,
  eventContent,
  eventTime,
}: {
  eventID: string;
  eventPubkey: string;
  eventTime: any;
  eventContent: any;
}) {
  const [pool, relays]: any = useContext(RelayContext);

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [eventID],
          since: parseInt(eventTime),
          kinds: [1, 7],
          limit: 50,
        },
      ],
      relays,
      (event: any) => {
        switch (event.kind) {
          case 1:
            // update state
            setComments((comments) => (comments += 1));
            // save comment to database
            // createCacheCommentNote(event, eventID);
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
      1000,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );

    return () => {
      unsubscribe;
    };
  }, [eventID, eventTime, pool, relays]);

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
