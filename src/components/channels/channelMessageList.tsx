import ChannelMessageItem from '@components/channels/channelMessageItem';

import { useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export const ChannelMessageList = ({ data }: { data: any }) => {
  const virtuosoRef = useRef(null);

  const itemContent: any = useCallback(
    (index: string | number) => {
      return <ChannelMessageItem data={data[index]} />;
    },
    [data]
  );

  const computeItemKey = useCallback(
    (index: string | number) => {
      return data[index].id;
    },
    [data]
  );

  return (
    <div className="h-full w-full">
      <Virtuoso
        ref={virtuosoRef}
        data={data}
        itemContent={itemContent}
        computeItemKey={computeItemKey}
        initialTopMostItemIndex={data.length - 1}
        alignToBottom={true}
        followOutput={true}
        overscan={50}
        increaseViewportBy={{ top: 200, bottom: 200 }}
        className="scrollbar-hide h-full w-full overflow-y-auto"
      />
    </div>
  );
};
