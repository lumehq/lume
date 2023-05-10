import ChannelCreateModal from '@app/channel/components/createModal';
import ChannelsListItem from '@app/channel/components/item';

import { getChannels } from '@utils/storage';

import useSWR from 'swr';

const fetcher = () => getChannels(10, 0);

export default function ChannelsList() {
  const { data, error }: any = useSWR('channels', fetcher);

  return (
    <div className="flex flex-col">
      {!data || error ? (
        <>
          <div className="inline-flex h-8 items-center gap-2 rounded-md px-2.5">
            <div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800"></div>
            <div className="h-3 w-full animate-pulse bg-zinc-800"></div>
          </div>
          <div className="inline-flex h-8 items-center gap-2 rounded-md px-2.5">
            <div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800"></div>
            <div className="h-3 w-full animate-pulse bg-zinc-800"></div>
          </div>
        </>
      ) : (
        data.map((item: { event_id: string }) => <ChannelsListItem key={item.event_id} data={item} />)
      )}
      <ChannelCreateModal />
    </div>
  );
}
