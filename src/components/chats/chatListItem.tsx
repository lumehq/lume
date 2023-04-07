import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useMetadata } from '@utils/metadata';
import { truncate } from '@utils/truncate';

import { useRouter } from 'next/router';

export const ChatListItem = ({ pubkey }: { pubkey: string }) => {
  const router = useRouter();
  const profile = useMetadata(pubkey);

  const openChat = () => {
    router.replace({
      pathname: '/chats/[pubkey]',
      query: { pubkey: pubkey },
    });
  };

  return (
    <div
      onClick={() => openChat()}
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
    >
      <div className="relative h-5 w-5 shrink overflow-hidden rounded bg-white">
        <ImageWithFallback
          src={profile?.picture || DEFAULT_AVATAR}
          alt={pubkey}
          fill={true}
          className="rounded object-cover"
        />
      </div>
      <div>
        <h5 className="text-sm font-medium text-zinc-400">
          {profile?.display_name || profile?.name || truncate(pubkey, 16, ' .... ')}
        </h5>
      </div>
    </div>
  );
};
