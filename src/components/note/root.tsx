import { NoteContent } from '@components/note/content';
import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { createCacheNote, getNoteByID } from '@utils/storage';

import { useAtomValue } from 'jotai';
import { memo, useCallback, useContext, useEffect, useState } from 'react';

export const RootNote = memo(function RootNote({ id }: { id: string }) {
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

  if (event) {
    return (
      <div className="relative pb-5">
        <div className="absolute top-0 left-[21px] h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
        <NoteContent data={event} />
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
