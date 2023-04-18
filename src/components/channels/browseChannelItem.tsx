import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const BrowseChannelItem = ({ data }: { data: any }) => {
  const router = useRouter();
  const channel = JSON.parse(data.content);

  const openChannel = useCallback(
    (id: string) => {
      router.push(`/channels/${id}`);
    },
    [router]
  );

  return (
    <div
      onClick={() => openChannel(data.event_id)}
      className="group relative flex items-center gap-2 border-b border-zinc-800 px-3 py-2.5 hover:bg-black/20"
    >
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
      <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 transform group-hover:inline-flex">
        <button className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-button hover:bg-fuchsia-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
          Join
        </button>
      </div>
    </div>
  );
};
