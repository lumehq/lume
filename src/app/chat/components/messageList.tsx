import { ChatMessageItem } from '@app/chat/components/messages/item';

import { sortedChatMessagesAtom } from '@stores/chat';

import { useActiveAccount } from '@utils/hooks/useActiveAccount';

import { useAtomValue } from 'jotai';
import { useCallback, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function ChatMessageList() {
  const { account } = useActiveAccount();

  const virtuosoRef = useRef(null);
  const data = useAtomValue(sortedChatMessagesAtom);

  const itemContent: any = useCallback(
    (index: string | number) => {
      return <ChatMessageItem data={data[index]} userPubkey={account.pubkey} userPrivkey={account.privkey} />;
    },
    [account.privkey, account.pubkey, data]
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
}
