import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { ChatsListItem } from '@app/chats/components/item';
import { NewMessageModal } from '@app/chats/components/modal';
import { ChatsListSelfItem } from '@app/chats/components/self';
import { UnknownsModal } from '@app/chats/components/unknowns';

import { getChats } from '@libs/storage';

import { useAccount } from '@utils/hooks/useAccount';
import { Chats } from '@utils/types';

export function ChatsList() {
  const { account } = useAccount();
  const {
    status,
    data: chats,
    isFetching,
  } = useQuery(['chats'], async () => {
    return await getChats();
  });

  const renderItem = useCallback(
    (item: Chats) => {
      if (account.pubkey !== item.sender_pubkey) {
        return <ChatsListItem key={item.sender_pubkey} data={item} />;
      }
    },
    [chats]
  );

  if (status === 'loading') {
    return (
      <div className="flex flex-col">
        <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
          <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-zinc-800" />
        </div>
        <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
          <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {account ? (
        <ChatsListSelfItem data={account} />
      ) : (
        <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
          <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-zinc-800" />
        </div>
      )}
      {chats.follows.map((item) => renderItem(item))}
      {chats.unknowns.length > 0 && <UnknownsModal data={chats.unknowns} />}
      <NewMessageModal />
      {isFetching && (
        <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
          <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-zinc-800" />
        </div>
      )}
    </div>
  );
}
