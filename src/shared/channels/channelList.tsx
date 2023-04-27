import { ChannelListItem } from '@lume/shared/channels/channelListItem';
import { CreateChannelModal } from '@lume/shared/channels/createChannelModal';

let channels: any = [];

if (typeof window !== 'undefined') {
  const { getChannels } = await import('@lume/utils/storage');
  channels = await getChannels(100, 0);
}

export default function ChannelList() {
  return (
    <div className="flex flex-col gap-px">
      {channels.map((item: { event_id: string }) => (
        <ChannelListItem key={item.event_id} data={item} />
      ))}
      <CreateChannelModal />
    </div>
  );
}
