/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import NewsFeedLayout from '@layouts/newsfeedLayout';

import { DatabaseContext } from '@components/contexts/database';
import { RelayContext } from '@components/contexts/relay';
import { Placeholder } from '@components/note/placeholder';
import { Thread } from '@components/thread';

import { hoursAgo } from '@utils/getDate';

import { follows } from '@stores/follows';
import { relays } from '@stores/relays';

import { useStore } from '@nanostores/react';
import { dateToUnix } from 'nostr-react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, Suspense, useContext, useEffect, useRef, useState } from 'react';

export default function Page() {
  const db: any = useContext(DatabaseContext);
  const relayPool: any = useContext(RelayContext);

  const now = useRef(new Date());

  const $follows = useStore(follows);
  const $relays = useStore(relays);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsub = relayPool.subscribe(
      [
        {
          kinds: [1],
          authors: $follows,
          since: dateToUnix(hoursAgo(12, now.current)),
        },
      ],
      $relays,
      async (event: any) => {
        setEvents((events) => [event, ...events]);
      },
      undefined,
      (events: any, relayURL: any) => {
        console.log(events, relayURL);
      }
    );

    return () => unsub();
  }, [$follows, $relays, db, relayPool]);

  return (
    <div className="h-full w-full">
      <Suspense fallback={<Placeholder />}>
        <Thread data={events} />
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
