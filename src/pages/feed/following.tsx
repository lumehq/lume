import BaseLayout from '@layouts/baseLayout';
import UserLayout from '@layouts/userLayout';

import { Placeholder } from '@components/note/placeholder';
import { Thread } from '@components/thread';

import { hoursAgo } from '@utils/getDate';

import { follows } from '@stores/follows';

import { useStore } from '@nanostores/react';
import { dateToUnix, useNostrEvents } from 'nostr-react';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  Suspense,
  useRef,
} from 'react';

export default function Page() {
  const $follows = useStore(follows);
  const now = useRef(new Date());

  const { events } = useNostrEvents({
    filter: {
      authors: $follows,
      since: dateToUnix(hoursAgo(6, now.current)),
      kinds: [1],
      limit: 100,
    },
  });

  return (
    <div className="h-full w-full">
      <Suspense fallback={<Placeholder />}>
        <Thread data={events} />
      </Suspense>
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
