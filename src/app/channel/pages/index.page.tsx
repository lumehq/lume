import { AccountContext } from '@lume/shared/accountProvider';
import { ChannelBlackList } from '@lume/shared/channels/channelBlackList';
import { ChannelProfile } from '@lume/shared/channels/channelProfile';
import { UpdateChannelModal } from '@lume/shared/channels/updateChannelModal';
import { FormChannel } from '@lume/shared/form/channel';
import { RelayContext } from '@lume/shared/relaysProvider';
import { channelMessagesAtom, channelReplyAtom } from '@lume/stores/channel';
import { FULL_RELAYS } from '@lume/stores/constants';
import { dateToUnix, hoursAgo } from '@lume/utils/getDate';
import { usePageContext } from '@lume/utils/hooks/usePageContext';
import { arrayObjToPureArr } from '@lume/utils/transform';

import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { Suspense, lazy, useContext, useRef } from 'react';
import useSWRSubscription from 'swr/subscription';

const ChannelMessages = lazy(() => import('@lume/shared/channels/messages'));

let mutedList: any = [];
let activeMutedList: any = [];
let activeHidedList: any = [];

if (typeof window !== 'undefined') {
  const { getBlacklist, getActiveBlacklist, getActiveAccount } = await import('@lume/utils/storage');
  const activeAccount = await getActiveAccount();
  activeHidedList = await getActiveBlacklist(activeAccount.id, 43);
  activeMutedList = await getActiveBlacklist(activeAccount.id, 44);
  mutedList = await getBlacklist(activeAccount.id, 44);
}

export function Page() {
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const id = searchParams.id;
  const channelPubkey = searchParams.pubkey;

  const pool: any = useContext(RelayContext);
  const activeAccount: any = useContext(AccountContext);

  const setChannelMessages = useSetAtom(channelMessagesAtom);
  const resetChannelMessages = useResetAtom(channelMessagesAtom);
  const resetChannelReply = useResetAtom(channelReplyAtom);

  const now = useRef(new Date());
  const hided = arrayObjToPureArr(activeHidedList);
  const muted = arrayObjToPureArr(activeMutedList);

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
      FULL_RELAYS,
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
    <div className="flex h-full flex-col justify-between gap-2">
      <div className="flex h-11 w-full shrink-0 items-center justify-between">
        <div>
          <ChannelProfile id={id} pubkey={channelPubkey} />
        </div>
        <div className="flex items-center gap-2">
          <ChannelBlackList blacklist={mutedList} />
          {activeAccount.pubkey === channelPubkey && <UpdateChannelModal id={id} />}
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
  );
}
