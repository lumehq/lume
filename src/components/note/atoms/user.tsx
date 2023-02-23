/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import MoreIcon from '@assets/icons/More';

import Avatar from 'boring-avatars';
import { useNostrEvents } from 'nostr-react';
import { memo, useState } from 'react';
import Moment from 'react-moment';

export const User = memo(function User({ pubkey, time }: { pubkey: string; time: any }) {
  const [profile, setProfile] = useState({ picture: null, name: null });

  const { onEvent } = useNostrEvents({
    filter: {
      authors: [pubkey],
      kinds: [0],
    },
  });

  // #TODO: save response to DB
  onEvent((rawMetadata) => {
    try {
      const metadata: any = JSON.parse(rawMetadata.content);
      if (metadata) {
        setProfile(metadata);
      }
    } catch (err) {
      console.error(err, rawMetadata);
    }
  });

  return (
    <div className="relative flex items-start gap-4">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
        {profile.picture ? (
          <ImageWithFallback
            src={profile.picture}
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
              {profile.name ? profile.name : truncate(pubkey, 16, ' .... ')}
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
});
