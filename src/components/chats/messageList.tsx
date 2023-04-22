import MessageListItem from '@components/chats/messageListItem';

import { sortedChatMessagesAtom } from '@stores/chat';

import useLocalStorage from '@rehooks/local-storage';
import { useAtomValue } from 'jotai';
import { useCallback, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Virtuoso } from 'react-virtuoso';

export const MessageList = () => {
  const virtuosoRef = useRef(null);
  const data = useAtomValue(sortedChatMessagesAtom);

  const [activeAccount]: any = useLocalStorage('account', {});

  const itemContent: any = useCallback(
    (index: string | number) => {
      return (
        <MessageListItem data={data[index]} userPubkey={activeAccount.pubkey} userPrivkey={activeAccount.privkey} />
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
        components={COMPONENTS}
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

const COMPONENTS = {
  EmptyPlaceholder: () => <Skeleton />,
};
