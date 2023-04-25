import { AccountContext } from '@components/accountProvider';
import FormChat from '@components/form/chat';
import NewsfeedLayout from '@components/layouts/newsfeed';
import { RelayContext } from '@components/relaysProvider';

import { chatMessagesAtom } from '@stores/chat';
import { FULL_RELAYS } from '@stores/constants';

import { usePageContext } from '@utils/hooks/usePageContext';

import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { Suspense, lazy, useContext } from 'react';
import useSWRSubscription from 'swr/subscription';

const MessageList = lazy(() => import('@components/chats/messageList'));

export function Page() {
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const pubkey = searchParams.pubkey;

  const pool: any = useContext(RelayContext);
  const activeAccount: any = useContext(AccountContext);

  const setChatMessages = useSetAtom(chatMessagesAtom);
  const resetChatMessages = useResetAtom(chatMessagesAtom);

  useSWRSubscription(pubkey, () => {
    // clear old messages
    resetChatMessages();
    // subscribe for next messages
    const unsubscribe = pool.subscribe(
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
        setChatMessages((prev) => [...prev, event]);
      }
    );

    return () => {
      unsubscribe();
    };
  });

  return (
    <NewsfeedLayout>
      <div className="relative flex h-full w-full flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
        <Suspense fallback={<p>Loading...</p>}>
          <MessageList />
        </Suspense>
        <div className="shrink-0 p-3">
          <FormChat receiverPubkey={pubkey} />
        </div>
      </div>
    </NewsfeedLayout>
  );
}
