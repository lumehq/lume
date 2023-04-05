import { ImageWithFallback } from '@components/imageWithFallback';
import { RelayContext } from '@components/relaysProvider';

import { DEFAULT_AVATAR } from '@stores/constants';

import { truncate } from '@utils/truncate';

import { Author } from 'nostr-relaypool';
import { memo, useContext, useEffect, useState } from 'react';

export const UserBase = memo(function UserBase({ pubkey }: { pubkey: string }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const user = new Author(pool, relays, pubkey);
    user.metaData((res) => setProfile(JSON.parse(res.content)), 0);
  }, [pool, relays, pubkey]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
        <ImageWithFallback
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          fill={true}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex w-full flex-1 flex-col items-start text-start">
        <span className="truncate font-medium leading-tight text-zinc-200">
          {profile?.display_name || profile?.name}
        </span>
        <span className="text-sm leading-tight text-zinc-400">{truncate(pubkey, 16, ' .... ')}</span>
      </div>
    </div>
  );
});
