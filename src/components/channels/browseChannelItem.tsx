import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useRouter } from 'next/router';

export const BrowseChannelItem = ({ data }: { data: any }) => {
  const router = useRouter();
  const channel = JSON.parse(data.content);

  const openChannel = (id) => {
    router.push({
      pathname: '/channels/[id]',
      query: { id: id },
    });
  };

  return (
    <div onClick={() => openChannel(data.eventId)} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-950">
      <div className="relative h-11 w-11 shrink overflow-hidden rounded-md border border-white/10">
        <ImageWithFallback
          src={channel.picture || DEFAULT_AVATAR}
          alt={data.id}
          fill={true}
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex w-full flex-1 flex-col items-start text-start">
        <span className="truncate font-medium leading-tight text-zinc-200">{channel.name}</span>
        <span className="text-sm leading-tight text-zinc-400">{channel.about}</span>
      </div>
    </div>
  );
};
