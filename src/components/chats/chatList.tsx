import { ChatListItem } from '@components/chats/chatListItem';
import { ChatModal } from '@components/chats/chatModal';
import { ImageWithFallback } from '@components/imageWithFallback';

import { DEFAULT_AVATAR } from '@stores/constants';

import { getChats } from '@utils/storage';

import useLocalStorage from '@rehooks/local-storage';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ChatList() {
  const [list, setList] = useState([]);
  const [activeAccount]: any = useLocalStorage('account', {});
  const profile = JSON.parse(activeAccount.metadata);

  useEffect(() => {
    let ignore = false;

    getChats(activeAccount.id)
      .then((res: any) => {
        if (!ignore) {
          setList(res);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [activeAccount.id]);

  return (
    <div className="flex flex-col gap-px">
      <Link
        prefetch={false}
        href={`/nostr/chat?pubkey=${activeAccount.pubkey}`}
        className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
      >
        <div className="relative h-5 w-5 shrink overflow-hidden rounded bg-white">
          <ImageWithFallback
            src={profile?.picture || DEFAULT_AVATAR}
            alt={activeAccount.pubkey}
            fill={true}
            className="rounded object-cover"
          />
        </div>
        <div>
          <h5 className="text-sm font-medium text-zinc-400">
            {profile?.display_name || profile?.name} <span className="text-zinc-500">(you)</span>
          </h5>
        </div>
      </Link>
      {list.map((item) => (
        <ChatListItem key={item.id} pubkey={item.pubkey} />
      ))}
      <ChatModal />
    </div>
  );
}
