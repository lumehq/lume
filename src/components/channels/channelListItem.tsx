import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useChannelMetadata } from '@utils/hooks/useChannelMetadata';

import Link from 'next/link';

export const ChannelListItem = ({ data }: { data: any }) => {
  const channel = useChannelMetadata(data.event_id, data.metadata);

  return (
    <Link
      prefetch={false}
      href={`/nostr/channel?channel-id=${data.event_id}`}
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
        <h5 className="truncate text-sm font-medium text-zinc-400">{channel?.name.toLowerCase()}</h5>
      </div>
    </Link>
  );
};
