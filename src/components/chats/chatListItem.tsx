import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { shortenKey } from '@utils/shortenKey';

export const ChatListItem = ({ pubkey }: { pubkey: string }) => {
  const profile = useProfileMetadata(pubkey);

  return (
    <a
      href={`/chat?pubkey=${pubkey}`}
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
    >
      <div className="relative h-5 w-5 shrink rounded">
        <img src={profile?.picture || DEFAULT_AVATAR} alt={pubkey} className="h-5 w-5 rounded object-cover" />
      </div>
      <div>
        <h5 className="text-sm font-medium text-zinc-400">
          {profile?.display_name || profile?.name || shortenKey(pubkey)}
        </h5>
      </div>
    </a>
  );
};
