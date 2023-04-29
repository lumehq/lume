import ChannelBlackList from '@lume/app/channel/components/blacklist';
import ChannelMembers from '@lume/app/channel/components/members';
import ChannelMessageForm from '@lume/app/channel/components/messages/form';
import ChannelMetadata from '@lume/app/channel/components/metadata';
import ChannelUpdateModal from '@lume/app/channel/components/updateModal';
import { channelMessagesAtom, channelReplyAtom } from '@lume/stores/channel';
import { FULL_RELAYS } from '@lume/stores/constants';
import { dateToUnix, hoursAgo } from '@lume/utils/getDate';
import { useActiveAccount } from '@lume/utils/hooks/useActiveAccount';
import { usePageContext } from '@lume/utils/hooks/usePageContext';
import { arrayObjToPureArr } from '@lume/utils/transform';

import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { RelayPool } from 'nostr-relaypool';
import { Suspense, lazy, useEffect, useRef } from 'react';
import useSWRSubscription from 'swr/subscription';

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

const ChannelMessageList = lazy(() => import('@lume/app/channel/components/messageList'));

export function Page() {
  const pageContext = usePageContext();
  const searchParams: any = pageContext.urlParsed.search;

  const channelID = searchParams.id;
  const channelPubkey = searchParams.pubkey;

  const { account, isLoading, isError } = useActiveAccount();

  const setChannelMessages = useSetAtom(channelMessagesAtom);
  const resetChannelMessages = useResetAtom(channelMessagesAtom);
  const resetChannelReply = useResetAtom(channelReplyAtom);

  const now = useRef(new Date());
  const hided = arrayObjToPureArr(activeHidedList);
  const muted = arrayObjToPureArr(activeMutedList);

  useSWRSubscription(channelID ? channelID : null, (key: string, {}: any) => {
    // subscribe to channel
    const pool = new RelayPool(FULL_RELAYS);
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [key],
          kinds: [42],
          since: dateToUnix(hoursAgo(24, now.current)),
          limit: 20,
        },
      ],
      FULL_RELAYS,
      (event) => {
        const message: any = event;
        if (hided.includes(event.id)) {
          message['hide'] = true;
        }
        if (!muted.includes(event.pubkey)) {
          setChannelMessages((prev) => [...prev, message]);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    // reset channel reply
    resetChannelReply();
    // reset channel messages
    resetChannelMessages();
  });

  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <div className="flex h-11 w-full shrink-0 items-center justify-between">
        <div>
          <ChannelMetadata id={channelID} pubkey={channelPubkey} />
        </div>
        <div className="flex items-center gap-2">
          <ChannelMembers />
          <ChannelBlackList blacklist={mutedList} />
          {!isLoading && !isError && account ? (
            account.pubkey === channelPubkey && <ChannelUpdateModal id={account.id} />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="relative flex w-full flex-1 flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20">
        <Suspense fallback={<p>Loading...</p>}>
          <ChannelMessageList />
        </Suspense>
        <div className="inline-flex shrink-0 p-3">
          <ChannelMessageForm channelID={channelID} />
        </div>
      </div>
    </div>
  );
}
