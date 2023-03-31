import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';
import { UserMention } from '@components/user/mention';

import { createCacheNote, getNoteByID } from '@utils/storage';

import destr from 'destr';
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import reactStringReplace from 'react-string-replace';

export const NoteRepost = memo(function NoteRepost({ id }: { id: string }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [event, setEvent] = useState(null);
  const unsubscribe = useRef(null);

  const fetchEvent = useCallback(() => {
    unsubscribe.current = pool.subscribe(
      [
        {
          ids: [id],
          kinds: [1],
        },
      ],
      relays,
      (event: any) => {
        // update state
        setEvent(event);
        // insert to database
        createCacheNote(event);
      },
      undefined,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );
  }, [id, pool, relays]);

  useEffect(() => {
    getNoteByID(id).then((res) => {
      if (res) {
        setEvent(res);
      } else {
        fetchEvent();
      }
    });

    return () => {
      unsubscribe.current;
    };
  }, [fetchEvent, id]);

  const content = useMemo(() => {
    let parsedContent = event ? event.content : null;

    if (parsedContent !== null) {
      // get data tags
      const tags = destr(event.tags);
      // handle urls
      parsedContent = reactStringReplace(parsedContent, /(https?:\/\/\S+)/g, (match, i) => (
        <a key={match + i} href={match} target="_blank" rel="noreferrer">
          {match}
        </a>
      ));
      // handle #-hashtags
      parsedContent = reactStringReplace(parsedContent, /#(\w+)/g, (match, i) => (
        <span key={match + i} className="cursor-pointer text-fuchsia-500">
          #{match}
        </span>
      ));
      // handle mentions
      if (tags.length > 0) {
        parsedContent = reactStringReplace(parsedContent, /\#\[(\d+)\]/gm, (match, i) => {
          if (tags[match][0] === 'p') {
            // @-mentions
            return <UserMention key={match + i} pubkey={tags[match][1]} />;
          } else {
            return;
          }
        });
      }
    }

    return parsedContent;
  }, [event]);

  if (event) {
    return (
      <div className="relative mb-2 mt-3 rounded-lg border border-zinc-700 bg-zinc-800 p-2 py-3">
        <div className="relative z-10 flex flex-col">
          <UserExtend pubkey={event.pubkey} time={event.created_at} />
          <div className="-mt-5 pl-[52px]">
            <div className="flex flex-col gap-2">
              <div className="prose prose-zinc max-w-none break-words text-[15px] leading-tight dark:prose-invert prose-p:m-0 prose-p:text-[15px] prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-img:m-0 prose-video:m-0">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="mt-2 h-6 animate-pulse select-text flex-col rounded bg-zinc-700 pb-5"></div>;
  }
});
