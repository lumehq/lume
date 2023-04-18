import { ActiveLink } from '@components/activeLink';
import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

export const ChannelListItem = ({ data }: { data: any }) => {
  const channel = JSON.parse(data.content);

  return (
    <ActiveLink
      href={`/nostr/channels/${data.event_id}`}
      activeClassName="dark:bg-zinc-900 dark:text-zinc-100 hover:dark:bg-zinc-800"
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
    >
      <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
        <ImageWithFallback
          src={channel?.picture || DEFAULT_AVATAR}
          alt={data.event_id}
          fill={true}
          className="rounded object-cover"
        />
      </div>
      <div>
        <h5 className="truncate text-sm font-medium text-zinc-400">{channel.name}</h5>
      </div>
    </ActiveLink>
  );
};
