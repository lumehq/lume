import NoteMetadata from '@components/note/metadata';
import { ImagePreview } from '@components/note/preview/image';
import { VideoPreview } from '@components/note/preview/video';
import { NoteRepost } from '@components/note/repost';
import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';
import { UserMention } from '@components/user/mention';

import { relaysAtom } from '@stores/relays';

import { createCacheNote, getNoteByID } from '@utils/storage';

import destr from 'destr';
import { useAtomValue } from 'jotai';
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';
import reactStringReplace from 'react-string-replace';

export const NoteParent = memo(function NoteParent({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);

  const relays = useAtomValue(relaysAtom);
  const [event, setEvent] = useState(null);

  const fetchEvent = useCallback(() => {
    pool.subscribe(
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
  }, [fetchEvent, id]);

  const content = useMemo(() => {
    let parsedContent = event ? event.content : null;

    if (parsedContent !== null) {
      // get data tags
      const tags = destr(event.tags);
      // handle urls
      parsedContent = reactStringReplace(parsedContent, /(https?:\/\/\S+)/g, (match, i) => {
        if (match.toLowerCase().match(/\.(jpg|jpeg|gif|png|webp)$/)) {
          // image url
          return <ImagePreview key={match + i} url={match} />;
        } else if (ReactPlayer.canPlay(match)) {
          return <VideoPreview key={match + i} url={match} />;
        } else {
          return (
            <a key={match + i} href={match} target="_blank" rel="noreferrer">
              {match}
            </a>
          );
        }
      });
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
          } else if (tags[match][0] === 'e') {
            // note-mentions
            return <NoteRepost key={match + i} id={tags[match][1]} />;
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
      <div className="relative pb-5">
        <div className="absolute top-0 left-[21px] h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
        <div className="relative z-10 flex flex-col">
          <UserExtend pubkey={event.pubkey} time={event.created_at} />
          <div className="-mt-5 pl-[52px]">
            <div className="flex flex-col gap-2">
              <div className="prose prose-zinc max-w-none break-words text-[15px] leading-tight dark:prose-invert prose-p:m-0 prose-p:text-[15px] prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-img:m-0 prose-video:m-0">
                {content}
              </div>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
            <NoteMetadata
              eventID={event.id}
              eventPubkey={event.pubkey}
              eventContent={event.content}
              eventTime={event.created_at}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative z-10 flex h-min animate-pulse select-text flex-col pb-5">
        <div className="flex items-start gap-2">
          <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-700" />
          <div className="flex w-full flex-1 items-start justify-between">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-16 rounded bg-zinc-700" />
                <span className="text-zinc-500">·</span>
                <div className="h-4 w-12 rounded bg-zinc-700" />
              </div>
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
            </div>
          </div>
        </div>
        <div className="-mt-5 pl-[52px]">
          <div className="flex flex-col gap-6">
            <div className="h-16 w-full rounded bg-zinc-700" />
            <div className="flex items-center gap-8">
              <div className="h-4 w-12 rounded bg-zinc-700" />
              <div className="h-4 w-12 rounded bg-zinc-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
