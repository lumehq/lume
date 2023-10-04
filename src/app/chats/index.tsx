import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Outlet } from 'react-router-dom';

import { ChatListItem } from '@app/chats/components/chaListItem';

import { LoaderIcon } from '@shared/icons';

import { useNostr } from '@utils/hooks/useNostr';

export function ChatsScreen() {
  const { getAllNIP04Chats } = useNostr();
  const { status, data } = useQuery(
    ['nip04-chats'],
    async () => {
      return await getAllNIP04Chats();
    },
    { refetchOnWindowFocus: false }
  );

  const renderItem = useCallback(
    (event: NDKEvent) => {
      return <ChatListItem key={event.id} event={event} />;
    },
    [data]
  );

  return (
    <div className="grid h-full w-full grid-cols-3">
      <div className="scrollbar-hide col-span-1 h-full overflow-y-auto border-r border-white/5">
        <div
          data-tauri-drag-region
          className="h-16 w-full shrink-0 border-b border-white/5"
        />
        <div className="flex h-full flex-col gap-1 py-2">
          {status === 'loading' ? (
            <div className="flex h-full w-full items-center justify-center pb-16">
              <div className="inline-flex flex-col items-center justify-center gap-2">
                <LoaderIcon className="h-5 w-5 animate-spin text-white" />
                <h5 className="text-white/50">Loading messages...</h5>
              </div>
            </div>
          ) : (
            data.map((item) => renderItem(item))
          )}
        </div>
      </div>
      <div className="col-span-2">
        <Outlet />
      </div>
    </div>
  );
}
