/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import NewsFeedLayout from '@layouts/newsfeedLayout';

import { RelayContext } from '@components/contexts/relay';

import { hoursAgo } from '@utils/getDate';

import { currentUser } from '@stores/currentUser';
import { follows } from '@stores/follows';
import { relays } from '@stores/relays';

import { useStore } from '@nanostores/react';
import { dateToUnix } from 'nostr-react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useRef } from 'react';

export default function Page() {
  const relayPool: any = useContext(RelayContext);
  const now = useRef(new Date());

  const $follows = useStore(follows);
  const $relays = useStore(relays);
  const $currentUser = useStore(currentUser);

  useEffect(() => {
    const unsub = relayPool.subscribe(
      [
        {
          kinds: [0, 1, 3, 5, 7],
          authors: $follows,
          since: dateToUnix(hoursAgo(12, now.current)),
        },
      ],
      $relays,
      async (event: any) => {
        switch (event.kind) {
          case 0:
            //await db.execute(`INSERT OR IGNORE INTO cache_profiles (id, metadata) VALUES ("${event.pubkey}", '${JSON.stringify(event.content)}')`);
            break;
          case 3:
            //await db.execute(`INSERT OR IGNORE INTO follows (pubkey, account, kind) VALUES ("${event.pubkey}", "${$currentUser.pubkey}", "1")`);
            break;
          case 1:
          case 5:
          case 7:
            /*
            const isMulti = event.tags.length > 0;
            await db.execute(
              `INSERT OR IGNORE INTO cache_notes (id, note, kind, is_multi) VALUES ("${event.pubkey}", '${JSON.stringify(event)}', "${
                event.kind
              }", "${isMulti}")`
            );
            */
            break;
          default:
            break;
        }
      },
      undefined,
      (events: any, relayURL: any) => {
        console.log(events, relayURL);
      }
    );

    return () => unsub();
  }, [$currentUser.pubkey, $follows, $relays, relayPool]);

  return <div className="h-full w-full"></div>;
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
