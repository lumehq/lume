import { NoteComment } from '@components/note/meta/comment';
import { NoteReaction } from '@components/note/meta/reaction';
import { RelayContext } from '@components/relaysProvider';

import useLocalStorage from '@rehooks/local-storage';
import { memo, useContext, useEffect, useState } from 'react';

export const NoteMetadata = memo(function NoteMetadata({
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
  const [activeAccount]: any = useLocalStorage('account', {});

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [eventID],
          since: parseInt(eventTime),
          kinds: [1, 7],
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
            if (event.pubkey === activeAccount.pubkey) {
              setLiked(true);
            }
            if (event.content === '🤙' || event.content === '+') {
              setLikeCount((likes) => (likes += 1));
            }
            break;
          default:
            break;
        }
      },
      100,
      undefined,
      {
        unsubscribeOnEose: true,
        logAllEvents: false,
      }
    );

    return () => {
      unsubscribe();
    };
  }, [eventID, eventTime, pool, relays, activeAccount.pubkey]);

  return (
    <div className="relative z-10 -ml-1 flex items-center gap-8">
      <NoteComment
        count={comments}
        eventID={eventID}
        eventPubkey={eventPubkey}
        eventContent={eventContent}
        eventTime={eventTime}
      />
      <NoteReaction count={likeCount} liked={liked} eventID={eventID} eventPubkey={eventPubkey} />
    </div>
  );
});
