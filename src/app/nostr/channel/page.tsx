'use client';

import { ChannelMessages } from '@components/channels/messages';
import { FormChannel } from '@components/form/channel';
import { RelayContext } from '@components/relaysProvider';

import { channelMessagesAtom, channelReplyAtom } from '@stores/channel';
import { FULL_RELAYS } from '@stores/constants';

import { dateToUnix, hoursAgo } from '@utils/getDate';

import useLocalStorage from '@rehooks/local-storage';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef } from 'react';
import useSWRSubscription from 'swr/subscription';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('channel-id');

  const [pool]: any = useContext(RelayContext);
  const [activeAccount]: any = useLocalStorage('account', {});

  const setChannelMessages = useSetAtom(channelMessagesAtom);
  const resetChannelMessages = useResetAtom(channelMessagesAtom);
  const resetChannelReply = useResetAtom(channelReplyAtom);

  const now = useRef(new Date());
  const muted = useRef(new Set());
  const hided = useRef(new Set());

  useSWRSubscription(id, () => {
    const unsubscribe = pool.subscribe(
      [
        {
          authors: [activeAccount.pubkey],
          kinds: [43, 44],
          since: dateToUnix(hoursAgo(48, now.current)),
        },
        {
          '#e': [id],
          kinds: [42],
          since: dateToUnix(hoursAgo(48, now.current)),
        },
      ],
      FULL_RELAYS,
      (event: { kind: number; tags: string[][]; pubkey: string; id: string }) => {
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
            setChannelMessages((prev) => [...prev, event]);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      // reset channel reply
      resetChannelReply();
      // reset channel messages
      resetChannelMessages();
    }

    return () => {
      ignore = true;
    };
  }, [resetChannelReply, resetChannelMessages]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <ChannelMessages />
      <div className="shrink-0 p-3">
        <FormChannel eventId={id} />
      </div>
    </div>
  );
}
