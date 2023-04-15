'use client';

import { MessageList } from '@components/chats/messageList';
import FormChat from '@components/form/chat';
import { RelayContext } from '@components/relaysProvider';

import useLocalStorage from '@rehooks/local-storage';
import { useContext, useEffect, useState } from 'react';

export default function Page({ params }: { params: { pubkey: string } }) {
  const [pool, relays]: any = useContext(RelayContext);

  const [activeAccount]: any = useLocalStorage('activeAccount', {});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [4],
          authors: [params.pubkey],
          '#p': [activeAccount.pubkey],
        },
        {
          kinds: [4],
          authors: [activeAccount.pubkey],
          '#p': [params.pubkey],
        },
      ],
      relays,
      (event: any) => {
        setMessages((messages) => [event, ...messages]);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [pool, relays, params.pubkey, activeAccount.pubkey]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <MessageList data={messages.sort((a, b) => a.created_at - b.created_at)} />
      <div className="shrink-0 p-3">
        <FormChat receiverPubkey={params.pubkey} />
      </div>
    </div>
  );
}
