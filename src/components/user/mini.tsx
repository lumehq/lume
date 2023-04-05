import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { truncate } from '@utils/truncate';

import { useCallback, useEffect, useState } from 'react';

export const UserMini = ({ pubkey }: { pubkey: string }) => {
  const [profile, setProfile] = useState(null);

  const getCachedMetadata = useCallback(async () => {
    const { getPlebByPubkey } = await import('@utils/bindings');
    getPlebByPubkey({ pubkey: pubkey })
      .then((res) => {
        if (res) {
          const metadata = JSON.parse(res.metadata);
          setProfile(metadata);
        }
      })
      .catch(console.error);
  }, [pubkey]);

  useEffect(() => {
    getCachedMetadata().catch(console.error);
  }, [getCachedMetadata]);

  if (profile) {
    return (
      <div className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium hover:bg-zinc-900">
        <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
          <ImageWithFallback
            src={profile?.picture || DEFAULT_AVATAR}
            alt={pubkey}
            fill={true}
            className="rounded object-cover"
          />
        </div>
        <div className="inline-flex w-full flex-1 flex-col overflow-hidden">
          <p className="truncate leading-tight text-zinc-300">
            {profile?.display_name || profile?.name || truncate(pubkey, 16, ' .... ')}
          </p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
