import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { ChannelMessages } from '@components/channels/messages/index';
import FormChannelMessage from '@components/form/channelMessage';
import { RelayContext } from '@components/relaysProvider';

import { channelReplyAtom } from '@stores/channel';

import { useResetAtom } from 'jotai/utils';
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
  const id: string | string[] = router.query.id || null;

  const [messages, setMessages] = useState([]);
  const resetChannelReply = useResetAtom(channelReplyAtom);

  useEffect(() => {
    // reset channel reply
    resetChannelReply();
    // subscribe event
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [id],
          kinds: [42],
          since: 0,
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
  }, [id, pool, relays, resetChannelReply]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <ChannelMessages data={messages.sort((a, b) => a.created_at - b.created_at)} />
      <div className="shrink-0 p-3">
        <FormChannelMessage eventId={id} />
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
