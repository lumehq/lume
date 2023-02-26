/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import NewsFeedLayout from '@layouts/newsfeedLayout';

import { hoursAgo } from '@utils/getDate';

import { RelayContext } from '@stores/context';
import { follows } from '@stores/follows';
import { relays } from '@stores/relays';

import { useStore } from '@nanostores/react';
import { dateToUnix } from 'nostr-react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useRef, useState } from 'react';

export default function Page() {
  const relayPool: any = useContext(RelayContext);

  const [data, setData] = useState([]);
  const now = useRef(new Date());

  const $follows = useStore(follows);
  const $relays = useStore(relays);

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
      (event: any) => {
        setData((data) => [event, ...data]);
      },
      undefined,
      (events: any, relayURL: any) => {
        console.log(events, relayURL);
      }
    );

    return () => unsub();
  }, [$follows, $relays, relayPool]);

  return (
    <div className="h-full w-full">
      {data.map((item, index) => (
        <p key={index}>{item.id}</p>
      ))}
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
