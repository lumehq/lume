'use client';

import FormBase from '@components/form/base';
import { NoteBase } from '@components/note/base';
import { Placeholder } from '@components/note/placeholder';
import { NoteQuoteRepost } from '@components/note/quoteRepost';

import { filteredNotesAtom, hasNewerNoteAtom, notesAtom } from '@stores/note';

import { dateToUnix } from '@utils/getDate';

import { ArrowUp } from 'iconoir-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function Page() {
  const [hasNewerNote, setHasNewerNote] = useAtom(hasNewerNoteAtom);
  const setData = useSetAtom(notesAtom);
  const data = useAtomValue(filteredNotesAtom);

  const virtuosoRef = useRef(null);
  const now = useRef(new Date());
  const limit = useRef(20);
  const offset = useRef(0);

  const itemContent: any = useCallback(
    (index: string | number) => {
      switch (data[index].kind) {
        case 1:
          return <NoteBase event={data[index]} />;
        case 6:
          return <NoteQuoteRepost event={data[index]} />;
        default:
          break;
      }
    },
    [data]
  );

  const computeItemKey = useCallback(
    (index: string | number) => {
      return data[index].eventId;
    },
    [data]
  );

  const initialData = useCallback(async () => {
    const { getNotes } = await import('@utils/bindings');
    const result: any = await getNotes({
      date: dateToUnix(now.current),
      limit: limit.current,
      offset: offset.current,
    });
    setData((data) => [...data, ...result]);
  }, [setData]);

  const loadMore = useCallback(async () => {
    const { getNotes } = await import('@utils/bindings');
    offset.current += limit.current;
    // next query
    const result: any = await getNotes({
      date: dateToUnix(now.current),
      limit: limit.current,
      offset: offset.current,
    });
    setData((data) => [...data, ...result]);
  }, [setData]);

  const loadLatest = useCallback(async () => {
    const { getLatestNotes } = await import('@utils/bindings');
    // next query
    const result: any = await getLatestNotes({ date: dateToUnix(now.current) });
    // update data
    if (Array.isArray(result)) {
      setData((data) => [...data, ...result]);
    } else {
      setData((data) => [...data, result]);
    }
    // hide newer trigger
    setHasNewerNote(false);
    // scroll to top
    virtuosoRef.current.scrollToIndex({ index: -1 });
  }, [setData, setHasNewerNote]);

  useEffect(() => {
    initialData().catch(console.error);
  }, [initialData]);

  return (
    <div className="relative h-full w-full">
      {hasNewerNote && (
        <div className="absolute left-1/2 top-2 z-50 -translate-x-1/2 transform">
          <button
            onClick={() => loadLatest()}
            className="inline-flex h-8 transform items-center justify-center gap-1 rounded-full bg-fuchsia-500 pl-3 pr-3.5 text-sm shadow-md shadow-fuchsia-800/20 active:translate-y-1"
          >
            <ArrowUp width={14} height={14} />
            Load latest
          </button>
        </div>
      )}
      <Virtuoso
        ref={virtuosoRef}
        data={data}
        itemContent={itemContent}
        computeItemKey={computeItemKey}
        components={COMPONENTS}
        overscan={200}
        endReached={loadMore}
        className="scrollbar-hide h-full w-full overflow-y-auto"
      />
    </div>
  );
}

const COMPONENTS = {
  Header: () => <FormBase />,
  EmptyPlaceholder: () => <Placeholder />,
  ScrollSeekPlaceholder: () => <Placeholder />,
};
