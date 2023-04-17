import { ActiveLink } from '@components/activeLink';
import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { truncate } from '@utils/truncate';

export const ChatListItem = ({ pubkey }: { pubkey: string }) => {
  const profile = useProfileMetadata(pubkey);

  return (
    <ActiveLink
      href={`/chats/${pubkey}`}
      activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
    >
      <div className="relative h-5 w-5 shrink overflow-hidden rounded">
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
    </ActiveLink>
  );
};
