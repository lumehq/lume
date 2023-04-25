import { ChannelProfile } from '@components/channels/channelProfile';
import { FormChannel } from '@components/form/channel';
import NewsfeedLayout from '@components/layouts/newsfeed';
import { RelayContext } from '@components/relaysProvider';

import { channelMessagesAtom, channelReplyAtom } from '@stores/channel';
import { MESSAGE_RELAYS } from '@stores/constants';

import { dateToUnix, hoursAgo } from '@utils/getDate';
import { usePageContext } from '@utils/hooks/usePageContext';
import { arrayObjToPureArr } from '@utils/transform';

import { EyeClose, MicMute } from 'iconoir-react';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { Suspense, lazy, useContext, useRef } from 'react';
import useSWRSubscription from 'swr/subscription';

const ChannelMessages = lazy(() => import('@components/channels/messages'));

let mutedList: any = [];
let hidedList: any = [];

if (typeof window !== 'undefined') {
  const { getBlacklist, getActiveAccount } = await import('@utils/storage');
  const activeAccount = await getActiveAccount();
  hidedList = await getBlacklist(activeAccount.id, 43);
  mutedList = await getBlacklist(activeAccount.id, 44);
}

export function Page() {
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const id = searchParams.id;
  const channelPubkey = searchParams.pubkey;

  const pool: any = useContext(RelayContext);

  const setChannelMessages = useSetAtom(channelMessagesAtom);
  const resetChannelMessages = useResetAtom(channelMessagesAtom);
  const resetChannelReply = useResetAtom(channelReplyAtom);

  const now = useRef(new Date());
  const hided = arrayObjToPureArr(hidedList);
  const muted = arrayObjToPureArr(mutedList);

  useSWRSubscription(id, () => {
    // reset channel reply
    resetChannelReply();
    // reset channel messages
    resetChannelMessages();
    // subscribe for new messages
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [id],
          kinds: [42],
          since: dateToUnix(hoursAgo(48, now.current)),
        },
      ],
      MESSAGE_RELAYS,
      (event: { kind: number; tags: string[][]; pubkey: string; id: string }) => {
        if (muted.includes(event.pubkey)) {
          console.log('muted');
        } else if (hided.includes(event.id)) {
          console.log('hided');
        } else {
          setChannelMessages((prev) => [...prev, event]);
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
            <ChannelProfile id={id} pubkey={channelPubkey} />
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
