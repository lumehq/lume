'use client';

import { ChannelMessages } from '@components/channels/messages/index';
import FormChannelMessage from '@components/form/channelMessage';
import { RelayContext } from '@components/relaysProvider';

import { channelMessagesAtom, channelReplyAtom } from '@stores/channel';
import { FULL_RELAYS } from '@stores/constants';

import useLocalStorage from '@rehooks/local-storage';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { Suspense, useContext, useEffect, useRef } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  const [pool]: any = useContext(RelayContext);
  const [activeAccount]: any = useLocalStorage('account', {});

  const setChannelMessages = useSetAtom(channelMessagesAtom);
  const resetChannelMessages = useResetAtom(channelMessagesAtom);
  const resetChannelReply = useResetAtom(channelReplyAtom);

  const muted = useRef(new Set());
  const hided = useRef(new Set());

  useEffect(() => {
    // reset channel reply
    resetChannelReply();
    // reset channel messages
    resetChannelMessages();
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
      FULL_RELAYS,
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
            setChannelMessages((messages) => [event, ...messages]);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [pool, activeAccount.pubkey, params.id, setChannelMessages, resetChannelReply, resetChannelMessages]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Suspense fallback={<>Loading...</>}>
        <ChannelMessages />
      </Suspense>
      <div className="shrink-0 p-3">
        <FormChannelMessage eventId={params.id} />
      </div>
    </div>
  );
}
