import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';

import { contentParser } from '@utils/parser';
import { createNote, getNoteByID } from '@utils/storage';
import { getParentID } from '@utils/transform';

import useLocalStorage from '@rehooks/local-storage';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const NoteQuote = memo(function NoteQuote({ id }: { id: string }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [activeAccount]: any = useLocalStorage('account', {});
  const [event, setEvent] = useState(null);

  const content = event ? contentParser(event.content, event.tags) : '';

  const fetchEvent = useCallback(async () => {
    const unsubscribe = pool.subscribe(
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

    return () => {
      unsubscribe();
    };
  }, [activeAccount.id, id, pool, relays]);

  const checkNoteIsSaved = useCallback(async () => {
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
    let ignore = false;

    if (!ignore) {
      checkNoteIsSaved();
    }

    return () => {
      ignore = true;
    };
  }, [checkNoteIsSaved]);

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
