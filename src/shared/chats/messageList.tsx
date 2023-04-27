import { AccountContext } from '@lume/shared/accountProvider';
import { MessageListItem } from '@lume/shared/chats/messageListItem';
import { Placeholder } from '@lume/shared/note/placeholder';
import { sortedChatMessagesAtom } from '@lume/stores/chat';

import { useAtomValue } from 'jotai';
import { useCallback, useContext, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function MessageList() {
  const activeAccount: any = useContext(AccountContext);

  const virtuosoRef = useRef(null);
  const data = useAtomValue(sortedChatMessagesAtom);

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
}

const COMPONENTS = {
  EmptyPlaceholder: () => <Placeholder />,
};
