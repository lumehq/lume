/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout from '@layouts/baseLayout';
import UserLayout from '@layouts/userLayout';

import { useRouter } from 'next/router';
import { useNostrEvents } from 'nostr-react';
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';

export default function Page() {
  const router = useRouter();
  const { id }: any = router.query;

  const { events } = useNostrEvents({
    filter: {
      '#e': [id],
      since: 0,
      kinds: [1],
      limit: 20,
    },
  });

  return (
    <>
      {events.map((event) => (
        <p key={event.id}>
          {event.pubkey} posted: {event.content}
        </p>
      ))}
    </>
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
