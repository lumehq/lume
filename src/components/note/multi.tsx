import Reaction from '@components/note/atoms/reaction';
import Reply from '@components/note/atoms/reply';
import { User } from '@components/note/atoms/user';
import { Placeholder } from '@components/note/placeholder';

import dynamic from 'next/dynamic';
import { useNostrEvents } from 'nostr-react';

const DynamicContent = dynamic(() => import('@components/note/content'), {
  ssr: false,
  loading: () => (
    <>
      <p>Loading...</p>
    </>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Multi({ event }: { event: any }) {
  const tags = event.tags;

  const { events } = useNostrEvents({
    filter: {
      ids: [tags[0][1]],
      since: 0,
      kinds: [1],
      limit: 1,
    },
  });

  if (events !== undefined && events.length > 0) {
    return (
      <div className="relative flex h-min min-h-min w-full select-text flex-col overflow-hidden border-b border-zinc-800">
        <div className="absolute left-[45px] top-6 h-full w-[2px] bg-zinc-800"></div>
        <div className="flex flex-col bg-zinc-900 px-6 pt-6 pb-2">
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
        <div className="relative flex flex-col bg-zinc-900 px-6 pb-6">
          <User pubkey={event.pubkey} time={event.created_at} />
          <div className="relative z-10 -mt-4 pl-[60px]">
            <div className="flex flex-col gap-2">
              <DynamicContent data={event.content} />
              <div className="-ml-1 flex items-center gap-8">
                <Reply eventID={event.id} />
                <Reaction eventID={event.id} eventPubkey={event.pubkey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Placeholder />;
  }
}
