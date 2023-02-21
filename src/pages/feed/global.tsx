import BaseLayout from '@layouts/baseLayout';
import UserLayout from '@layouts/userLayout';

import { Thread } from '@components/thread';

import { hoursAgo } from '@utils/getDate';

import { dateToUnix, useNostrEvents } from 'nostr-react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useRef } from 'react';

export default function Page() {
  const now = useRef(new Date());

  const { events } = useNostrEvents({
    filter: {
      since: dateToUnix(hoursAgo(1, now.current)),
      kinds: [1],
    },
  });

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-input">
      <Thread data={events} />
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
      <UserLayout>{page}</UserLayout>
    </BaseLayout>
  );
};
