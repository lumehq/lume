import { ChannelListItem } from '@components/channels/channelListItem';
import { CreateChannelModal } from '@components/channels/createChannelModal';

import { DEFAULT_CHANNELS } from '@stores/constants';

import { useState } from 'react';

export default function ChannelList() {
  const [list] = useState(DEFAULT_CHANNELS);

  return (
    <div className="flex flex-col gap-px">
      {list.map((item) => (
        <ChannelListItem key={item.event_id} data={item} />
      ))}
      <CreateChannelModal />
    </div>
  );
}
