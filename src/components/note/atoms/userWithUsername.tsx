/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageWithFallback } from '@components/imageWithFallback';

import { truncate } from '@utils/truncate';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import Avatar from 'boring-avatars';
import { useNostrEvents } from 'nostr-react';
import { memo, useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

const db = typeof window !== 'undefined' ? await Database.load('sqlite:lume.db') : null;

export const UserWithUsername = memo(function UserWithUsername({ pubkey }: { pubkey: string }) {
  const [profile, setProfile] = useState({ picture: null, name: null, username: null });

  const { onEvent } = useNostrEvents({
    filter: {
      authors: [pubkey],
      kinds: [0],
    },
  });

  onEvent(async (rawMetadata) => {
    try {
      const metadata: any = JSON.parse(rawMetadata.content);
      if (profile.picture === null || profile.name === null) {
        setProfile(metadata);
        await db.execute(`INSERT OR IGNORE INTO cache_profiles (pubkey, metadata) VALUES ("${pubkey}", '${JSON.stringify(metadata)}')`);
      } else {
        return;
      }
    } catch (err) {
      console.error(err, rawMetadata);
    }
  });

  useEffect(() => {
    const initialProfile = async () => {
      const result: any = await db.select(`SELECT metadata FROM cache_profiles WHERE pubkey = "${pubkey}"`);
      return result;
    };

    initialProfile()
      .then((res) => {
        if (res[0] !== undefined) {
          setProfile(JSON.parse(res[0].metadata));
        }
      })
      .catch(console.error);
  }, [pubkey]);

  return (
    <div className="relative flex items-start gap-2">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-full border border-white/10">
        {profile.picture ? (
          <ImageWithFallback src={profile.picture} alt={pubkey} fill={true} className="rounded-full object-cover" />
        ) : (
          <Avatar size={44} name={pubkey} variant="beam" colors={['#FEE2E2', '#FEF3C7', '#F59E0B', '#EC4899', '#D946EF', '#8B5CF6']} />
        )}
      </div>
      <div className="flex w-full flex-1 items-start justify-between">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-bold leading-tight">{profile.name ? profile.name : truncate(pubkey, 16, ' .... ')}</span>
            <span className="text-zinc-500">{profile.username ? profile.username : truncate(pubkey, 16, ' .... ')}</span>
          </div>
          <div>
            <DotsHorizontalIcon className="h-4 w-4 text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
});
