import MessageListItem from '@components/chats/messageListItem';

import { useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export const MessageList = ({ data }: { data: any }) => {
  const virtuosoRef = useRef(null);

  const itemContent: any = useCallback(
    (index: string | number) => {
      const activeAccount = JSON.parse(localStorage.getItem('activeAccount'));
      return (
        <MessageListItem
          data={data[index]}
          activeAccountPubkey={activeAccount.pubkey}
          activeAccountPrivkey={activeAccount.privkey}
        />
      );
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
        className="scrollbar-hide h-full w-full overflow-y-auto"
      />
    </div>
  );
};
