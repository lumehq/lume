import { ChannelListItem } from '@components/channels/channelListItem';
import { CreateChannelModal } from '@components/channels/createChannelModal';

import { channelsAtom, defaultChannelsAtom } from '@stores/channel';

import { useAtomValue } from 'jotai';

export default function ChannelList() {
  let atom;

  if (typeof window !== 'undefined') {
    atom = channelsAtom;
  } else {
    atom = defaultChannelsAtom;
  }

  const list: any = useAtomValue(atom);

  return (
    <div className="flex flex-col gap-px">
      {list.map((item: { event_id: string }) => (
        <ChannelListItem key={item.event_id} data={item} />
      ))}
      <CreateChannelModal />
    </div>
  );
}
