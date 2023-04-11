import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { BrowseChannelItem } from '@components/channels/browseChannelItem';

import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from 'react';

export default function Page() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      const { getChannels } = await import('@utils/bindings');
      return await getChannels({ limit: 100, offset: 0 });
    };

    fetchChannels()
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

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return (
    <BaseLayout>
      <WithSidebarLayout>{page}</WithSidebarLayout>
    </BaseLayout>
  );
};
