'use client';

import { BrowseChannelItem } from '@components/channels/browseChannelItem';

import { getChannels } from '@utils/storage';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

export default function Page() {
  const [data, setData] = useState([]);

  const virtuosoRef = useRef(null);
  const limit = useRef(20);
  const offset = useRef(0);

  const itemContent: any = useCallback(
    (index: string | number) => {
      return <BrowseChannelItem key={data[index].event_id} data={data[index]} />;
    },
    [data]
  );

  const computeItemKey = useCallback(
    (index: string | number) => {
      return data[index].event_id;
    },
    [data]
  );

  const initialData = useCallback(async () => {
    const result: any = await getChannels(limit.current, offset.current);
    console.log(result);
    setData((data) => [...data, ...result]);
  }, [setData]);

  const loadMore = useCallback(async () => {
    offset.current += limit.current;
    // query next page
    const result: any = await getChannels(limit.current, offset.current);
    setData((data) => [...data, ...result]);
  }, [setData]);

  useEffect(() => {
    initialData().catch(console.error);
  }, [initialData]);

  return (
    <div className="h-full w-full">
      <div className="mx-auto h-full w-full max-w-2xl px-4">
        <Suspense fallback={<>Loading...</>}>
          <VirtuosoGrid
            ref={virtuosoRef}
            data={data}
            itemContent={itemContent}
            itemClassName="col-span-1"
            listClassName="grid grid-cols-2 gap-4"
            computeItemKey={computeItemKey}
            overscan={200}
            endReached={loadMore}
            className="scrollbar-hide h-full w-full overflow-y-auto overflow-x-hidden"
          />
        </Suspense>
      </div>
    </div>
  );
}
