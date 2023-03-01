/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import NewsFeedLayout from '@layouts/newsfeedLayout';

import { DatabaseContext } from '@components/contexts/database';
import { NoteConnector } from '@components/note/connector';
import { Placeholder } from '@components/note/placeholder';
import { Repost } from '@components/note/repost';
import { Single } from '@components/note/single';

import { useCallback, useState } from 'react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function Page() {
  const { db }: any = useContext(DatabaseContext);
  const [data, setData] = useState([]);

  const limit = useRef(30);
  const offset = useRef(0);

  useEffect(() => {
    const getData = async () => {
      const result = await db.select(`SELECT * FROM cache_notes ORDER BY created_at DESC LIMIT ${limit.current}`);
      setData(result);
    };

    getData().catch(console.error);
  }, [db]);

  const loadMore = useCallback(async () => {
    offset.current += limit.current;
    // next query
    const result = await db.select(`SELECT * FROM cache_notes ORDER BY created_at DESC LIMIT ${limit.current} OFFSET ${offset.current}`);
    setData((data) => [...data, ...result]);
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

  const computeItemKey = useCallback(
    (index: string | number) => {
      return data[index].id;
    },
    [data]
  );

  return (
    <div className="h-full w-full">
      <NoteConnector />
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
        className="scrollbar-hide relative h-full w-full"
        style={{
          contain: 'strict',
        }}
      />
    </div>
  );
}

Page.getLayout = function getLayout(
  page: string | number | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | ReactFragment | ReactPortal
) {
  return (
    <BaseLayout>
      <NewsFeedLayout>{page}</NewsFeedLayout>
    </BaseLayout>
  );
};
