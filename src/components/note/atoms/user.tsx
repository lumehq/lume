/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import MoreIcon from '@assets/icons/More';

import Avatar from 'boring-avatars';
import { useNostrEvents } from 'nostr-react';
import { memo } from 'react';
import Moment from 'react-moment';

export const User = memo(function User({ pubkey, time }: { pubkey: string; time: any }) {
  const { events } = useNostrEvents({
    filter: {
      authors: [pubkey],
      kinds: [0],
    },
  });

  if (events !== undefined && events.length > 0) {
    const userData: any = JSON.parse(events[0].content);

    return (
      <div className="relative flex items-start gap-4">
        <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
          {userData?.picture ? (
            <ImageWithFallback
              src={userData.picture}
              alt={pubkey}
              fill={true}
              className="rounded-full object-cover"
            />
          ) : (
            <Avatar
              size={44}
              name={pubkey}
              variant="beam"
              colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']}
            />
          )}
        </div>
        <div className="flex w-full flex-1 items-start justify-between">
          <div className="flex w-full justify-between">
            <div className="flex items-baseline gap-2 text-sm">
              <span className="font-bold leading-tight">
                {userData?.name ? userData.name : truncate(pubkey, 16, ' .... ')}
              </span>
              <span className="leading-tight text-zinc-500">·</span>
              <Moment fromNow unix className="text-zinc-500">
                {time}
              </Moment>
            </div>
            <div>
              <MoreIcon />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative flex animate-pulse items-start gap-4">
        <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10 bg-zinc-700"></div>
        <div className="flex w-full flex-1 items-start justify-between">
          <div className="flex w-full justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-16 rounded bg-zinc-700" />
              <span className="text-zinc-500">·</span>
              <div className="h-4 w-16 rounded bg-zinc-700" />
            </div>
            <div>
              <MoreIcon />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
