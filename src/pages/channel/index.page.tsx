import { AccountContext } from '@components/accountProvider';
import { ChannelProfile } from '@components/channels/channelProfile';
import { FormChannel } from '@components/form/channel';
import NewsfeedLayout from '@components/layouts/newsfeed';
import { RelayContext } from '@components/relaysProvider';

import { channelMessagesAtom, channelReplyAtom } from '@stores/channel';
import { MESSAGE_RELAYS } from '@stores/constants';

import { dateToUnix, hoursAgo } from '@utils/getDate';
import { usePageContext } from '@utils/hooks/usePageContext';

import { EyeClose, MicMute } from 'iconoir-react';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { Suspense, lazy, useContext, useRef } from 'react';
import useSWRSubscription from 'swr/subscription';

const ChannelMessages = lazy(() => import('@components/channels/messages'));

export function Page() {
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const id = searchParams.id;

  const pool: any = useContext(RelayContext);
  const activeAccount: any = useContext(AccountContext);

  const setChannelMessages = useSetAtom(channelMessagesAtom);
  const resetChannelMessages = useResetAtom(channelMessagesAtom);
  const resetChannelReply = useResetAtom(channelReplyAtom);

  const now = useRef(new Date());
  const muted = useRef(new Set());
  const hided = useRef(new Set());

  useSWRSubscription(id, () => {
    // reset channel reply
    resetChannelReply();
    // reset channel messages
    resetChannelMessages();
    // subscribe for new messages
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
      MESSAGE_RELAYS,
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

  return (
    <NewsfeedLayout>
      <div className="flex h-full flex-col justify-between gap-2">
        <div className="flex h-11 w-full shrink-0 items-center justify-between">
          <div>
            <ChannelProfile id={id} />
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900">
              <EyeClose width={16} height={16} className="text-zinc-400" />
            </div>
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900">
              <MicMute width={16} height={16} className="text-zinc-400" />
            </div>
          </div>
        </div>
        <div className="relative flex w-full flex-1 flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
          <Suspense fallback={<p>Loading...</p>}>
            <ChannelMessages />
          </Suspense>
          <div className="shrink-0 p-3">
            <FormChannel eventId={id} />
          </div>
        </div>
      </div>
    </NewsfeedLayout>
  );
}
