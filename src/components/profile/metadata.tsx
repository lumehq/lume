import { ImageWithFallback } from '@components/imageWithFallback';
import { RelayContext } from '@components/relaysProvider';

import { DEFAULT_AVATAR } from '@stores/constants';

import { truncate } from '@utils/truncate';

import destr from 'destr';
import Image from 'next/image';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useState } from 'react';

const DEFAULT_BANNER = 'https://bafybeiacwit7hjmdefqggxqtgh6ht5dhth7ndptwn2msl5kpkodudsr7py.ipfs.w3s.link/banner-1.jpg';

export default function ProfileMetadata({ id }: { id: string }) {
  const [pool, relays]: any = useContext(RelayContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const user = new Author(pool, relays, id);
    user.metaData((res) => setProfile(destr(res.content)), 0);
  }, [id, pool, relays]);

  return (
    <>
      <div className="relative">
        <div className="relative h-56 w-full rounded-t-lg bg-zinc-800">
          <Image
            src={profile?.banner || DEFAULT_BANNER}
            alt="user's banner"
            fill={true}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative -top-8 z-10 px-4">
          <div className="relative h-16 w-16 rounded-lg bg-zinc-900 ring-2 ring-zinc-900">
            <ImageWithFallback
              src={profile?.picture || DEFAULT_AVATAR}
              alt={id}
              fill={true}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
      <div className="-mt-4 mb-8 px-4">
        <div>
          <div className="mb-3 flex flex-col">
            <h3 className="text-lg font-semibold leading-tight text-zinc-100">
              {profile?.display_name || profile?.name}
            </h3>
            <span className="text-sm leading-tight text-zinc-500">
              {profile?.username || (id && truncate(id, 16, ' .... '))}
            </span>
          </div>
          <div className="prose-sm prose-zinc leading-tight dark:prose-invert">{profile?.about}</div>
        </div>
      </div>
    </>
  );
}
