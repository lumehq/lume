import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { MessageList } from '@components/chats/messageList';
import FormChat from '@components/form/chat';
import { RelayContext } from '@components/relaysProvider';

import useLocalStorage from '@rehooks/local-storage';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useContext,
  useEffect,
  useState,
} from 'react';

export default function Page() {
  const [pool, relays]: any = useContext(RelayContext);

  const router = useRouter();
  const pubkey: any = router.query.pubkey || null;

  const [activeAccount]: any = useLocalStorage('activeAccount', {});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
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
      relays,
      (event: any) => {
        setMessages((messages) => [event, ...messages]);
      }
    );

    return () => {
      unsubscribe;
    };
  }, [pool, relays, pubkey, activeAccount.pubkey]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <MessageList data={messages.sort((a, b) => a.created_at - b.created_at)} />
      <div className="shrink-0 p-3">
        <FormChat receiverPubkey={pubkey} />
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return (
    <BaseLayout>
      <WithSidebarLayout>{page}</WithSidebarLayout>
    </BaseLayout>
  );
};
