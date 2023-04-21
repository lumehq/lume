'use client';

import { MessageList } from '@components/chats/messageList';
import FormChat from '@components/form/chat';
import { RelayContext } from '@components/relaysProvider';

import { chatMessagesAtom } from '@stores/chat';
import { FULL_RELAYS } from '@stores/constants';

import useLocalStorage from '@rehooks/local-storage';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useContext, useEffect } from 'react';

export default function Page({ params }: { params: { pubkey: string } }) {
  const [pool]: any = useContext(RelayContext);
  const [activeAccount]: any = useLocalStorage('account', {});

  const setChatMessages = useSetAtom(chatMessagesAtom);
  const resetChatMessages = useResetAtom(chatMessagesAtom);

  useEffect(() => {
    // reset stored messages
    resetChatMessages();
    // fetch messages from relays
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
      FULL_RELAYS,
      (event: any) => {
        setChatMessages((data) => [...data, event]);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [params.pubkey, activeAccount.pubkey, setChatMessages, pool]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <MessageList />
      <div className="shrink-0 p-3">
        <FormChat receiverPubkey={params.pubkey} />
      </div>
    </div>
  );
}
