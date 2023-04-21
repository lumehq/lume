import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR, DEFAULT_CHANNEL_BANNER } from '@stores/constants';

import { useChannelMetadata } from '@utils/hooks/useChannelMetadata';

export const BrowseChannelItem = ({ data }: { data: any }) => {
  const channel = useChannelMetadata(data.event_id, data.metadata);

  return (
    <div className="h-64 w-full rounded-md bg-zinc-900">
      <div className="relative h-24">
        <div className="h-24 w-full rounded-t-md bg-zinc-800">
          <ImageWithFallback
            src={channel?.banner || DEFAULT_CHANNEL_BANNER}
            alt={data.id}
            fill={true}
            className="h-full w-full rounded-t-md object-cover"
          />
        </div>
        <div className="relative -top-6 z-10 px-4">
          <div className="relative h-11 w-11 rounded-md bg-white">
            <ImageWithFallback
              src={channel?.picture || DEFAULT_AVATAR}
              alt={data.id}
              fill={true}
              className="rounded-md object-cover ring-1 ring-black/50"
            />
          </div>
        </div>
      </div>
      <div className="mt-7 px-4">
        <div className="flex flex-col">
          <h3 className="w-full truncate font-semibold leading-tight text-zinc-100">{channel?.name}</h3>
        </div>
        <div className="line-clamp-3 text-sm text-zinc-400">{channel?.about}</div>
      </div>
    </div>
  );
};
