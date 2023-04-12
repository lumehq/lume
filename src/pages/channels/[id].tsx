import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import { ChannelMessages } from '@components/channels/messages/index';
import FormChannelMessage from '@components/form/channelMessage';
import { RelayContext } from '@components/relaysProvider';

import { channelReplyAtom } from '@stores/channel';

import useLocalStorage from '@rehooks/local-storage';
import { useResetAtom } from 'jotai/utils';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function Page() {
  const [pool, relays]: any = useContext(RelayContext);

  const router = useRouter();
  const id: string | string[] = router.query.id || null;

  const [messages, setMessages] = useState([]);
  const [activeAccount]: any = useLocalStorage('activeAccount', {});
  const resetChannelReply = useResetAtom(channelReplyAtom);

  const muted = useRef(new Set());
  const hided = useRef(new Set());

  useEffect(() => {
    // reset channel reply
    resetChannelReply();
    // subscribe event
    const unsubscribe = pool.subscribe(
      [
        {
          authors: [activeAccount.pubkey],
          kinds: [43, 44],
          since: 0,
        },
        {
          '#e': [id],
          kinds: [42],
          since: 0,
        },
      ],
      relays,
      (event: any) => {
        if (event.kind === 44) {
          muted.current = muted.current.add(event.tags[0][1]);
        } else if (event.kind === 43) {
          hided.current = hided.current.add(event.tags[0][1]);
        } else {
          if (muted.current.has(event.pubkey)) {
            console.log('muted');
          } else if (hided.current.has(event.id)) {
            console.log('hided');
          } else {
            setMessages((messages) => [event, ...messages]);
          }
        }
      }
    );

    return () => {
      unsubscribe;
    };
  }, [id, pool, relays, activeAccount.pubkey, resetChannelReply]);

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
