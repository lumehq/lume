import { ImageWithFallback } from '@components/imageWithFallback';
import { RelayContext } from '@components/relaysProvider';

import { DEFAULT_AVATAR } from '@stores/constants';

import { truncate } from '@utils/truncate';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Author } from 'nostr-relaypool';
import { memo, useContext, useEffect, useState } from 'react';

dayjs.extend(relativeTime);

export const UserLarge = memo(function UserLarge({ pubkey, time }: { pubkey: string; time: any }) {
  const [pool, relays]: any = useContext(RelayContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const user = new Author(pool, relays, pubkey);
    user.metaData((res) => setProfile(JSON.parse(res.content)), 0);
  }, [pool, relays, pubkey]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-md bg-zinc-900">
        <ImageWithFallback
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          fill={true}
          className="rounded-md border border-white/10 object-cover"
        />
      </div>
      <div className="w-full flex-1">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-bold leading-tight text-zinc-100">
              {profile?.display_name || profile?.name || truncate(pubkey, 16, ' .... ')}
            </span>
            <span className="leading-tight text-zinc-400">
              {profile?.username || truncate(pubkey, 16, ' .... ')} · {dayjs().to(dayjs.unix(time))}
            </span>
          </div>
          <div>
            <button className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800">
              <DotsHorizontalIcon className="h-3 w-3 text-zinc-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
