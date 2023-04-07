import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import FormBase from '@components/form/base';
import { NoteBase } from '@components/note/base';
import { Placeholder } from '@components/note/placeholder';

import { hasNewerNoteAtom } from '@stores/note';

import { dateToUnix } from '@utils/getDate';
import { filterDuplicateParentID } from '@utils/transform';

import { ArrowUpIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function Page() {
  const [data, setData] = useState([]);
  const [hasNewerNote, setHasNewerNote] = useAtom(hasNewerNoteAtom);

  const virtuosoRef = useRef(null);
  const now = useRef(new Date());
  const limit = useRef(20);
  const offset = useRef(0);

  const itemContent: any = useCallback(
    (index: string | number) => {
      return <NoteBase event={data[index]} />;
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
  }, []);

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
  }, []);

  const loadLatest = useCallback(async () => {
    const { getLatestNotes } = await import('@utils/bindings');
    // next query
    const result: any = await getLatestNotes({ date: dateToUnix(now.current) });
    // update data
    if (result.length > 0) {
      setData((data) => [...data, ...result]);
    } else {
      setData((data) => [...data, result]);
    }
    // hide newer trigger
    setHasNewerNote(false);
    // scroll to top
    virtuosoRef.current.scrollToIndex({ index: 0 });
  }, [setHasNewerNote]);

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
            <ArrowUpIcon className="h-3.5 w-3.5" />
            Load latest
          </button>
        </div>
      )}
      <Virtuoso
        ref={virtuosoRef}
        data={filterDuplicateParentID(data)}
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

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return (
    <BaseLayout>
      <WithSidebarLayout>{page}</WithSidebarLayout>
    </BaseLayout>
  );
};
