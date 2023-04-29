import ChatMessageForm from '@lume/app/chat/components/messages/form';
import { RelayContext } from '@lume/shared/relayProvider';
import { chatMessagesAtom } from '@lume/stores/chat';
import { READONLY_RELAYS } from '@lume/stores/constants';
import { useActiveAccount } from '@lume/utils/hooks/useActiveAccount';
import { usePageContext } from '@lume/utils/hooks/usePageContext';

import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { Suspense, lazy, useContext, useEffect } from 'react';
import useSWRSubscription from 'swr/subscription';

const ChatMessageList = lazy(() => import('@lume/app/chat/components/messageList'));

export function Page() {
  const pool: any = useContext(RelayContext);
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const pubkey = searchParams.pubkey;

  const { account } = useActiveAccount();

  const setChatMessages = useSetAtom(chatMessagesAtom);
  const resetChatMessages = useResetAtom(chatMessagesAtom);

  useSWRSubscription(pubkey ? ['chat', pubkey] : null, ([, key], {}: any) => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [4],
          authors: [key],
          '#p': [account.pubkey],
          limit: 20,
        },
        {
          kinds: [4],
          authors: [account.pubkey],
          '#p': [key],
          limit: 20,
        },
      ],
      READONLY_RELAYS,
      (event: any) => {
        setChatMessages((prev) => [...prev, event]);
      }
    );

    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    // reset channel messages
    resetChatMessages();
  });

  return (
    <div className="relative flex h-full w-full flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
      <Suspense fallback={<p>Loading...</p>}>
        <ChatMessageList />
      </Suspense>
      <div className="shrink-0 p-3">
        <ChatMessageForm receiverPubkey={pubkey} />
      </div>
    </div>
  );
}
