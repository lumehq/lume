import { useQuery } from '@tanstack/react-query';

import { ChatsListItem } from '@app/chat/components/item';
import { NewMessageModal } from '@app/chat/components/modal';
import { ChatsListSelfItem } from '@app/chat/components/self';

import { getChats } from '@libs/storage';

import { StrangersIcon } from '@shared/icons';

import { useAccount } from '@utils/hooks/useAccount';
import { compactNumber } from '@utils/number';

export function ChatsList() {
  const { account } = useAccount();
  const {
    status,
    data: chats,
    isFetching,
  } = useQuery(['chats'], async () => {
    return await getChats();
  });

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
      {chats.follows.map((item) => {
        if (account.pubkey !== item.sender_pubkey) {
          return <ChatsListItem key={item.sender_pubkey} data={item} />;
        }
      })}
      <button
        type="button"
        className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5"
      >
        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
          <StrangersIcon className="h-3 w-3 text-zinc-200" />
        </div>
        <div>
          <h5 className="font-medium text-zinc-400">
            {compactNumber.format(chats.unknown)} strangers
          </h5>
        </div>
      </button>
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
