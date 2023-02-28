/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import NewsFeedLayout from '@layouts/newsfeedLayout';

import { DatabaseContext } from '@components/contexts/database';
import { Placeholder } from '@components/note/placeholder';
import { Thread } from '@components/thread';

import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, Suspense, useContext, useEffect, useRef, useState } from 'react';

export default function Page() {
  const db: any = useContext(DatabaseContext);
  const [data, setData] = useState([]);
  const limit = useRef(25);

  useEffect(() => {
    const getData = async () => {
      const result = await db.select(`SELECT * FROM cache_notes ORDER BY created_at DESC LIMIT ${limit.current}`);
      setData(result);
    };

    getData().catch(console.error);
  }, [db]);

  return (
    <div className="h-full w-full">
      <Suspense fallback={<Placeholder />}>
        <Thread data={data} />
      </Suspense>
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
