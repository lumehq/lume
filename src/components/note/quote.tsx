import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';

import { contentParser } from '@utils/parser';
import { getParentID } from '@utils/transform';

import useLocalStorage from '@rehooks/local-storage';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';

export const NoteQuote = memo(function NoteQuote({ id }: { id: string }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [activeAccount]: any = useLocalStorage('activeAccount', {});
  const [event, setEvent] = useState(null);
  const unsubscribe = useRef(null);

  const content = event ? contentParser(event.content, event.tags) : '';

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
      <div className="relative mb-2 mt-3 rounded-lg border border-zinc-700 bg-zinc-800 p-2 py-3">
        <div className="relative z-10 flex flex-col">
          <UserExtend pubkey={event.pubkey} time={event.createdAt || event.created_at} />
          <div className="mt-1 pl-[52px]">
            <div className="whitespace-pre-line break-words text-[15px] leading-tight text-zinc-100">{content}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="mt-2 h-6 animate-pulse select-text flex-col rounded bg-zinc-700 pb-5"></div>;
  }
});
