import { ChannelListItem } from '@components/channels/channelListItem';
import { CreateChannelModal } from '@components/channels/createChannelModal';

import { DEFAULT_CHANNELS } from '@stores/constants';

export default function ChannelList() {
  return (
    <div className="flex flex-col gap-px">
      {DEFAULT_CHANNELS.map((item) => (
        <ChannelListItem key={item.event_id} data={item} />
      ))}
      <CreateChannelModal />
    </div>
  );
}
