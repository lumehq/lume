import BaseLayout from '@layouts/baseLayout';
import NewsFeedLayout from '@layouts/newsfeedLayout';

import { DatabaseContext } from '@components/contexts/database';
import { NoteConnector } from '@components/note/connector';
import { Placeholder } from '@components/note/placeholder';
import { Repost } from '@components/note/repost';
import { Single } from '@components/note/single';

import { dateToUnix } from '@utils/getDate';

import { ArrowUpIcon } from '@radix-ui/react-icons';
import { writeStorage } from '@rehooks/local-storage';
import { useCallback, useState } from 'react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function Page() {
  const { db }: any = useContext(DatabaseContext);

  const [data, setData] = useState([]);
  const [parentReload, setParentReload] = useState(false);
  const [hasNewNote, setHasNewNote] = useState(false);

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
    setData((data) => [...result, ...data]);
    setHasNewNote(false);
  }, [db]);

  const ItemContent = useCallback(
    (index: string | number) => {
      const event = data[index];
      if (event.content.includes('#[0]') && event.tags[0][0] == 'e') {
        // type: repost
        return <Repost root={event.tags} user={event.pubkey} />;
      } else {
        // type: default
        return <Single event={event} />;
      }
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
      if (result) {
        setData(result);
        writeStorage('settings', new Date());
      }
    };

    getData().catch(console.error);
  }, [db, parentReload]);

  const computeItemKey = useCallback(
    (index: string | number) => {
      return data[index].id;
    },
    [data]
  );

  return (
    <div className="relative h-full w-full">
      <NoteConnector setParentReload={setParentReload} setHasNewNote={setHasNewNote} currentDate={now.current} />
      {hasNewNote && (
        <div className="absolute top-16 left-1/2 z-50 -translate-x-1/2 transform">
          <button
            onClick={() => loadNewest()}
            className="inline-flex h-8 transform items-center justify-center gap-1 rounded-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 pl-3 pr-3.5 text-sm shadow-lg active:translate-y-1"
          >
            <ArrowUpIcon className="h-4 w-4" />
            <span className="drop-shadow-md">Load newest</span>
          </button>
        </div>
      )}
      <Virtuoso
        data={data}
        itemContent={ItemContent}
        components={{
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
        className="relative h-full w-full"
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
      <NewsFeedLayout>{page}</NewsFeedLayout>
    </BaseLayout>
  );
};
