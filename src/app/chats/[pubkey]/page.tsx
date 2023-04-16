'use client';

import { MessageList } from '@components/chats/messageList';
import FormChat from '@components/form/chat';
import { RelayContext } from '@components/relaysProvider';

import { chatMessagesAtom } from '@stores/chat';

import useLocalStorage from '@rehooks/local-storage';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { Suspense, useCallback, useContext, useEffect, useRef } from 'react';

export default function Page({ params }: { params: { pubkey: string } }) {
  const [pool, relays]: any = useContext(RelayContext);
  const [activeAccount]: any = useLocalStorage('activeAccount', {});

  const setChatMessages = useSetAtom(chatMessagesAtom);
  const resetChatMessages = useResetAtom(chatMessagesAtom);

  const unsubscribe = useRef(null);

  const fetchMessages = useCallback(() => {
    unsubscribe.current = pool.subscribe(
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
        setChatMessages((data) => [...data, event]);
      }
    );
  }, [activeAccount.pubkey, params.pubkey, pool, relays, setChatMessages]);

  useEffect(() => {
    // reset stored messages
    resetChatMessages();
    // fetch messages from relays
    fetchMessages();

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [fetchMessages, resetChatMessages]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Suspense fallback={<>Loading...</>}>
        <MessageList />
      </Suspense>
      <div className="shrink-0 p-3">
        <FormChat receiverPubkey={params.pubkey} />
      </div>
    </div>
  );
}
