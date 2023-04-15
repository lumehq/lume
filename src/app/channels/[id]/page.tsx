'use client';

import { ChannelMessages } from '@components/channels/messages/index';
import FormChannelMessage from '@components/form/channelMessage';
import { RelayContext } from '@components/relaysProvider';

import { channelReplyAtom } from '@stores/channel';

import useLocalStorage from '@rehooks/local-storage';
import { useResetAtom } from 'jotai/utils';
import { useContext, useEffect, useRef, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  const [pool, relays]: any = useContext(RelayContext);

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
          '#e': [params.id],
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
      unsubscribe();
    };
  }, [pool, relays, activeAccount.pubkey, params.id, resetChannelReply]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <ChannelMessages data={messages.sort((a, b) => a.created_at - b.created_at)} />
      <div className="shrink-0 p-3">
        <FormChannelMessage eventId={params.id} />
      </div>
    </div>
  );
}
