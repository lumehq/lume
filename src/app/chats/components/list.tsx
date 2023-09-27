import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { ChatsListItem } from '@app/chats/components/item';
import { NewMessageModal } from '@app/chats/components/modal';
import { UnknownsModal } from '@app/chats/components/unknowns';

import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function ChatsList() {
  const { db } = useStorage();
  const { fetchNIP04Chats } = useNostr();
  const { status, data: chats } = useQuery(
    ['nip04-chats'],
    async () => {
      return await fetchNIP04Chats();
    },
    { refetchOnWindowFocus: false }
  );

  const renderItem = useCallback(
    (item: string) => {
      if (db.account.pubkey !== item) {
        return <ChatsListItem key={item} pubkey={item} />;
      }
    },
    [chats]
  );

  if (status === 'loading') {
    return (
      <div className="flex flex-col">
        <div className="inline-flex h-10 items-center gap-2.5 border-l-2 border-transparent pl-4">
          <div className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center">
            <LoaderIcon className="h-4 w-4 animate-spin text-white" />
          </div>
          <h5 className="text-white/50">Loading messages...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {chats?.follows?.map((item) => renderItem(item))}
      {chats?.unknowns?.length > 0 && <UnknownsModal data={chats.unknowns} />}
      <NewMessageModal />
    </div>
  );
}
