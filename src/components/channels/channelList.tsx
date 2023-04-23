import { ChannelListItem } from '@components/channels/channelListItem';
import { CreateChannelModal } from '@components/channels/createChannelModal';

import { channelsAtom } from '@stores/channel';

import { useAtomValue } from 'jotai';

export default function ChannelList() {
  const list = useAtomValue(channelsAtom);

  return (
    <div className="flex flex-col gap-px">
      {list.map((item: { event_id: string }) => (
        <ChannelListItem key={item.event_id} data={item} />
      ))}
      <CreateChannelModal />
    </div>
  );
}
