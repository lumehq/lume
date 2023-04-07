import { ChatListItem } from '@components/chats/chatListItem';
import { ImageWithFallback } from '@components/imageWithFallback';
import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { DEFAULT_AVATAR } from '@stores/constants';

import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

export default function ChatList() {
  const [pool, relays]: any = useContext(RelayContext);
  const router = useRouter();

  const activeAccount: any = useAtomValue(activeAccountAtom);
  const accountProfile = JSON.parse(activeAccount.metadata);

  const [list, setList] = useState(new Set());

  const openSelfChat = () => {
    router.replace({
      pathname: '/chats/[pubkey]',
      query: { pubkey: activeAccount.pubkey },
    });
  };

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [4],
          '#p': [activeAccount.pubkey],
          since: 0,
        },
      ],
      relays,
      (event: any) => {
        if (event.pubkey !== activeAccount.pubkey) {
          setList((list) => new Set(list).add(event.pubkey));
        }
      }
    );

    return () => {
      unsubscribe;
    };
  }, [pool, relays, activeAccount.pubkey]);

  return (
    <div className="flex flex-col gap-px">
      <div
        onClick={() => openSelfChat()}
        className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
      >
        <div className="relative h-5 w-5 shrink overflow-hidden rounded bg-white">
          <ImageWithFallback
            src={accountProfile.picture || DEFAULT_AVATAR}
            alt={activeAccount.pubkey}
            fill={true}
            className="rounded object-cover"
          />
        </div>
        <div>
          <h5 className="text-sm font-medium text-zinc-400">
            {accountProfile.display_name || accountProfile.name} <span className="text-zinc-500">(you)</span>
          </h5>
        </div>
      </div>
      {[...list].map((item: string, index) => (
        <ChatListItem key={index} pubkey={item} />
      ))}
    </div>
  );
}
