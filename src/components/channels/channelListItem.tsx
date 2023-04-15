import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useRouter } from 'next/navigation';

export const ChannelListItem = ({ data }: { data: any }) => {
  const router = useRouter();
  const channel = JSON.parse(data.content);

  const openChannel = (id: string) => {
    router.push(`/channels/${id}`);
  };

  return (
    <div
      onClick={() => openChannel(data.eventId)}
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
    >
      <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
        <ImageWithFallback
          src={channel?.picture || DEFAULT_AVATAR}
          alt={data.eventId}
          fill={true}
          className="rounded object-cover"
        />
      </div>
      <div>
        <h5 className="truncate text-sm font-medium text-zinc-400">{channel.name}</h5>
      </div>
    </div>
  );
};
