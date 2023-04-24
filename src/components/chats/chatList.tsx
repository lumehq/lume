import { AccountContext } from '@components/accountProvider';
import { ChatListItem } from '@components/chats/chatListItem';
import { ChatModal } from '@components/chats/chatModal';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useContext } from 'react';

let list: any = [];

if (typeof window !== 'undefined') {
  const { getChats, getActiveAccount } = await import('@utils/storage');
  const activeAccount = await getActiveAccount();

  list = await getChats(activeAccount.id);
}

export default function ChatList() {
  const activeAccount: any = useContext(AccountContext);
  const profile = typeof window !== 'undefined' ? JSON.parse(activeAccount.metadata) : null;

  return (
    <div className="flex flex-col gap-px">
      <a
        href={`/chat?pubkey=${activeAccount?.pubkey}`}
        className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
      >
        <div className="relative h-5 w-5 shrink rounded bg-white">
          <img
            src={profile?.picture || DEFAULT_AVATAR}
            alt={activeAccount?.pubkey}
            className="h-5 w-5 rounded object-cover"
          />
        </div>
        <div>
          <h5 className="text-sm font-medium text-zinc-400">
            {profile?.display_name || profile?.name} <span className="text-zinc-500">(you)</span>
          </h5>
        </div>
      </a>
      {list.map((item: { id: string; pubkey: string }) => (
        <ChatListItem key={item.id} pubkey={item.pubkey} />
      ))}
      <ChatModal />
    </div>
  );
}
