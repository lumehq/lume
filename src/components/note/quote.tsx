import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';

import { contentParser } from '@utils/parser';
import { createNote, getNoteByID } from '@utils/storage';
import { getParentID } from '@utils/transform';

import useLocalStorage from '@rehooks/local-storage';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';

export const NoteQuote = memo(function NoteQuote({ id }: { id: string }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [activeAccount]: any = useLocalStorage('account', {});
  const [event, setEvent] = useState(null);
  const unsubscribe = useRef(null);

  const content = event ? contentParser(event.content, event.tags) : '';

  const fetchEvent = useCallback(async () => {
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
        createNote(
          event.id,
          activeAccount.id,
          event.pubkey,
          event.kind,
          event.tags,
          event.content,
          event.created_at,
          parentID
        );
      },
      undefined,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );
  }, [activeAccount.id, id, pool, relays]);

  const checkNoteExist = useCallback(async () => {
    getNoteByID(id)
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
          <UserExtend pubkey={event.pubkey} time={event.created_at} />
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
