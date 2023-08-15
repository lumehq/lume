import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { ChatsListItem } from '@app/chats/components/item';
import { NewMessageModal } from '@app/chats/components/modal';
import { ChatsListSelfItem } from '@app/chats/components/self';
import { UnknownsModal } from '@app/chats/components/unknowns';

import { useNDK } from '@libs/ndk/provider';
import { getChats } from '@libs/storage';
import { useStorage } from '@libs/storage/provider';

import { Chats } from '@utils/types';

export function ChatsList() {
  const { db } = useStorage();
  const { ndk } = useNDK();
  const { status, data: chats } = useQuery(['chats'], async () => {
    return await getChats();
  });

  const renderItem = useCallback(
    (item: Chats) => {
      if (db.account.pubkey !== item.sender_pubkey) {
        return <ChatsListItem key={item.sender_pubkey} data={item} />;
      }
    },
    [chats]
  );

  if (status === 'loading') {
    return (
      <div className="flex flex-col">
        <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
          <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-white/10" />
        </div>
        <div className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5">
          <div className="relative h-6 w-6 shrink-0 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ChatsListSelfItem pubkey={db.account.pubkey} />
      {chats.follows.map((item) => renderItem(item))}
      {chats.unknowns.length > 0 && <UnknownsModal data={chats.unknowns} />}
      <NewMessageModal />
    </div>
  );
}
