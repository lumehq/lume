'use client';

import { MessageList } from '@components/chats/messageList';
import FormChat from '@components/form/chat';
import { RelayContext } from '@components/relaysProvider';

import { chatMessagesAtom } from '@stores/chat';
import { FULL_RELAYS } from '@stores/constants';

import useLocalStorage from '@rehooks/local-storage';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useContext, useEffect, useRef } from 'react';

export default function Page() {
  const searchParams = useSearchParams();
  const pubkey = searchParams.get('pubkey');

  const [pool]: any = useContext(RelayContext);
  const [activeAccount]: any = useLocalStorage('account', {});

  const setChatMessages = useSetAtom(chatMessagesAtom);
  const resetChatMessages = useResetAtom(chatMessagesAtom);

  const unsubscribe = useRef(null);

  const fetchMessages = useCallback(() => {
    unsubscribe.current = pool.subscribe(
      [
        {
          kinds: [4],
          authors: [pubkey],
          '#p': [activeAccount.pubkey],
        },
        {
          kinds: [4],
          authors: [activeAccount.pubkey],
          '#p': [pubkey],
        },
      ],
      FULL_RELAYS,
      (event: any) => {
        setChatMessages((data) => [...data, event]);
      }
    );
  }, [activeAccount.pubkey, pubkey, pool, setChatMessages]);

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
        <FormChat receiverPubkey={pubkey} />
      </div>
    </div>
  );
}
