import { useQuery } from '@tanstack/react-query';

import { ChannelCreateModal } from '@app/channel/components/createModal';
import { ChannelsListItem } from '@app/channel/components/item';

import { getChannels } from '@libs/storage';

export function ChannelsList() {
  const {
    status,
    data: channels,
    isFetching,
  } = useQuery(
    ['channels'],
    async () => {
      return await getChannels();
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="flex flex-col">
      {status === 'loading' ? (
        <>
          <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
            <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
            <div className="h-3.5 w-full animate-pulse rounded-sm bg-zinc-800" />
          </div>
          <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
            <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
            <div className="h-3.5 w-full animate-pulse rounded-sm bg-zinc-800" />
          </div>
        </>
      ) : (
        channels.map((item: { event_id: string }) => (
          <ChannelsListItem key={item.event_id} data={item} />
        ))
      )}
      {isFetching && (
        <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
          <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
          <div className="h-3.5 w-full animate-pulse rounded-sm bg-zinc-800" />
        </div>
      )}
      <ChannelCreateModal />
    </div>
  );
}
