import MessageListItem from '@components/chats/messageListItem';

import useLocalStorage from '@rehooks/local-storage';
import { useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export const MessageList = ({ data }: { data: any }) => {
  const [activeAccount]: any = useLocalStorage('activeAccount');
  const virtuosoRef = useRef(null);

  const itemContent: any = useCallback(
    (index: string | number) => {
      return (
        <MessageListItem
          data={data[index]}
          activeAccountPubkey={activeAccount.pubkey}
          activeAccountPrivkey={activeAccount.privkey}
        />
      );
    },
    [activeAccount.privkey, activeAccount.pubkey, data]
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
