import NoteMetadata from '@components/note/metadata';
import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';

import { contentParser } from '@utils/parser';
import { getParentID } from '@utils/transform';

import useLocalStorage from '@rehooks/local-storage';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';

export const NoteParent = memo(function NoteParent({ id }: { id: string }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [activeAccount]: any = useLocalStorage('activeAccount', {});
  const [event, setEvent] = useState(null);
  const unsubscribe = useRef(null);

  const content = event ? contentParser(event?.content, event.tags) : '';

  const fetchEvent = useCallback(async () => {
    const { createNote } = await import('@utils/bindings');
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
        const parentID = getParentID(event.tags, event.id);
        // insert event to local database
        createNote({
          event_id: event.id,
          pubkey: event.pubkey,
          kind: event.kind,
          tags: JSON.stringify(event.tags),
          content: event.content,
          parent_id: parentID,
          parent_comment_id: '',
          created_at: event.created_at,
          account_id: activeAccount.id,
        }).catch(console.error);
      },
      undefined,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );
  }, [activeAccount.id, id, pool, relays]);

  const checkNoteExist = useCallback(async () => {
    const { getNoteById } = await import('@utils/bindings');
    getNoteById({ event_id: id })
      .then((res) => {
        if (res) {
          setEvent(res);
        } else {
          fetchEvent();
        }
      })
      .catch(console.error);
  }, [fetchEvent, id]);

  useEffect(() => {
    checkNoteExist();

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [checkNoteExist]);

  if (event) {
    return (
      <div className="relative pb-5">
        <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
        <div className="relative z-10 flex flex-col">
          <UserExtend pubkey={event.pubkey} time={event.createdAt || event.created_at} />
          <div className="-mt-5 pl-[52px]">
            <div className="flex flex-col gap-2">
              <div className="prose prose-zinc max-w-none whitespace-pre-line break-words text-[15px] leading-tight dark:prose-invert prose-p:m-0 prose-p:text-[15px] prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-img:m-0 prose-video:m-0">
                {content}
              </div>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()} className="mt-5 pl-[52px]">
            <NoteMetadata
              eventID={event.eventId}
              eventPubkey={event.pubkey}
              eventContent={event.content}
              eventTime={event.createdAt || event.created_at}
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
