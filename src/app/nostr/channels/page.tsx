'use client';

import { BrowseChannelItem } from '@components/channels/browseChannelItem';

import { getChannels } from '@utils/storage';

import { useEffect, useState } from 'react';

export default function Page() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getChannels(100, 0)
      .then((res) => setList(res))
      .catch(console.error);
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto">
      {list.map((channel) => (
        <BrowseChannelItem key={channel.id} data={channel} />
      ))}
    </div>
  );
}
