import Reaction from '@components/note/atoms/reaction';
import Reply from '@components/note/atoms/reply';
import RootUser from '@components/note/atoms/rootUser';
import User from '@components/note/atoms/user';
import { Placeholder } from '@components/note/placeholder';

import RepostIcon from '@assets/icons/Repost';

import dynamic from 'next/dynamic';
import { useNostrEvents } from 'nostr-react';
import { memo } from 'react';

const DynamicContent = dynamic(() => import('@components/note/content'), {
  ssr: false,
  loading: () => (
    <>
      <p>Loading...</p>
    </>
  ),
});

export const Repost = memo(function Repost({
  eventUser,
  sourceID,
}: {
  eventUser: string;
  sourceID: string;
}) {
  const { events } = useNostrEvents({
    filter: {
      ids: [sourceID],
      since: 0,
      kinds: [1],
      limit: 1,
    },
  });

  if (events !== undefined && events.length > 0) {
    return (
      <div className="flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 py-6 px-6">
        <div className="flex items-center gap-1 pl-8 text-sm">
          <RepostIcon className="h-4 w-4 text-zinc-400" />
          <div className="ml-2">
            <RootUser userPubkey={eventUser} action={'repost'} />
          </div>
        </div>
        <div className="flex flex-col">
          <User pubkey={events[0].pubkey} time={events[0].created_at} />
          <div className="-mt-4 pl-[60px]">
            <div className="flex flex-col gap-2">
              <DynamicContent data={events[0].content} />
              <div className="-ml-1 flex items-center gap-8">
                <Reply eventID={events[0].id} />
                <Reaction eventID={events[0].id} eventPubkey={events[0].pubkey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Placeholder />;
  }
});
