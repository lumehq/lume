import ChatsListItem from '@lume/app/chat/components/item';
import ChatsListSelfItem from '@lume/app/chat/components/self';
import { useActiveAccount } from '@lume/utils/hooks/useActiveAccount';
import { getChats } from '@lume/utils/storage';

import useSWR from 'swr';

const fetcher = ([, account]) => getChats(account);

export default function ChatsList() {
  const { account, isLoading, isError } = useActiveAccount();
  const { data: chats, error }: any = useSWR(!isLoading && !isError && account ? ['chats', account] : null, fetcher);

  return (
    <div className="flex flex-col gap-px">
      <>
        <ChatsListSelfItem />
        {error && <div>failed to fetch</div>}
        {!chats ? (
          <>
            <div className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5">
              <div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800"></div>
              <div className="h-3 w-full animate-pulse bg-zinc-800"></div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5">
              <div className="relative h-5 w-5 shrink-0 animate-pulse rounded bg-zinc-800"></div>
              <div className="h-3 w-full animate-pulse bg-zinc-800"></div>
            </div>
          </>
        ) : (
          chats.map((item: { pubkey: string }) => <ChatsListItem key={item.pubkey} pubkey={item.pubkey} />)
        )}
      </>
    </div>
  );
}
