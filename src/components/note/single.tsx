/* eslint-disable @typescript-eslint/no-explicit-any */
import Reaction from '@components/note/atoms/reaction';
import Reply from '@components/note/atoms/reply';
import { User } from '@components/note/atoms/user';

import dynamic from 'next/dynamic';
import { memo } from 'react';

const DynamicContent = dynamic(() => import('@components/note/content'), {
  ssr: false,
  loading: () => (
    <>
      <p>Loading...</p>
    </>
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Single = memo(function Single({ event }: { event: any }) {
  return (
    <div className="flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 py-6 px-6">
      <div className="flex flex-col">
        <User pubkey={event.pubkey} time={event.created_at} />
        <div className="-mt-4 pl-[60px]">
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
});
