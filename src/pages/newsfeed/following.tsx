import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { DatabaseContext } from '@components/contexts/database';
import NoteForm from '@components/note/form';
import { Placeholder } from '@components/note/placeholder';
import { Single } from '@components/note/single';

import { atomHasNewerNote } from '@stores/note';

import { dateToUnix } from '@utils/getDate';

import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function Page() {
  const { db }: any = useContext(DatabaseContext);

  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [hasNewerNote, setHasNewerNote] = useAtom(atomHasNewerNote);

  const now = useRef(new Date());
  const limit = useRef(30);
  const offset = useRef(0);

  const loadMore = useCallback(async () => {
    offset.current += limit.current;
    // next query
    const result = await db.select(
      `SELECT * FROM
        cache_notes
        WHERE created_at <= ${dateToUnix(now.current)}
        ORDER BY created_at DESC
        LIMIT ${limit.current} OFFSET ${offset.current}`
    );
    setData((data) => [...data, ...result]);
  }, [db]);

  const loadNewest = useCallback(async () => {
    const result = await db.select(
      `SELECT * FROM
        cache_notes
        WHERE created_at > ${dateToUnix(now.current)}
        ORDER BY created_at DESC
        LIMIT ${limit.current}`
    );
    // update data
    setData((data) => [...result, ...data]);
    // update hasNewerNote to false to disable button
    setHasNewerNote(false);
    // update current time, fixed duplicate note
    now.current = new Date();
  }, [db, setHasNewerNote]);

  const ItemContent = useCallback(
    (index: string | number) => {
      const event = data[index];
      return <Single event={event} />;
    },
    [data]
  );

  const computeItemKey = useCallback(
    (index: string | number) => {
      return data[index].id;
    },
    [data]
  );

  useEffect(() => {
    const getData = async () => {
      const result = await db.select(
        `SELECT * FROM cache_notes WHERE created_at <= ${dateToUnix(now.current)} ORDER BY created_at DESC LIMIT ${
          limit.current
        }`
      );
      if (result.length > 0) {
        setData(result);
      } else {
        setReload(true);
      }
    };

    if (reload === false) {
      getData().catch(console.error);
    } else {
      const timer = setTimeout(() => {
        getData().catch(console.error);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [db, reload]);

  return (
    <div className="relative h-full w-full">
      {hasNewerNote && (
        <div className="absolute top-8 left-1/2 z-50 -translate-x-1/2 transform">
          <button
            onClick={() => loadNewest()}
            className="inline-flex h-8 transform items-center justify-center gap-1 rounded-full bg-fuchsia-500 px-3 text-sm shadow-lg active:translate-y-1"
          >
            <span className="text-white drop-shadow">Load newest</span>
          </button>
        </div>
      )}
      <Virtuoso
        data={data}
        itemContent={ItemContent}
        components={{
          Header: () => <NoteForm />,
          EmptyPlaceholder: () => <Placeholder />,
          ScrollSeekPlaceholder: () => <Placeholder />,
        }}
        computeItemKey={computeItemKey}
        scrollSeekConfiguration={{
          enter: (velocity) => Math.abs(velocity) > 800,
          exit: (velocity) => Math.abs(velocity) < 500,
        }}
        endReached={loadMore}
        overscan={800}
        increaseViewportBy={1000}
        className="scrollbar-hide relative h-full w-full"
        style={{
          contain: 'strict',
        }}
      />
    </div>
  );
}

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
