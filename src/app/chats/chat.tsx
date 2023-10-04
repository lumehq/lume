import { NDKEvent, NDKSubscription } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { VList, VListHandle } from 'virtua';

import { ChatMessageForm } from '@app/chats/components/messages/form';
import { ChatMessageItem } from '@app/chats/components/messages/item';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

import { useNostr } from '@utils/hooks/useNostr';

export function ChatScreen() {
  const listRef = useRef<VListHandle>(null);
  const userPrivkey = useStronghold((state) => state.privkey);

  const { db } = useStorage();
  const { ndk } = useNDK();
  const { pubkey } = useParams();
  const { fetchNIP04Messages } = useNostr();
  const { status, data } = useQuery(['nip04-dm', pubkey], async () => {
    return await fetchNIP04Messages(pubkey);
  });

  const renderItem = useCallback(
    (message: NDKEvent) => {
      return (
        <ChatMessageItem
          message={message}
          userPubkey={db.account.pubkey}
          userPrivkey={userPrivkey}
        />
      );
    },
    [data]
  );

  useEffect(() => {
    if (data.length > 0) listRef.current?.scrollToIndex(data.length);
  }, [data]);

  useEffect(() => {
    const sub: NDKSubscription = ndk.subscribe(
      {
        kinds: [4],
        authors: [db.account.pubkey],
        '#p': [pubkey],
        since: Math.floor(Date.now() / 1000),
      },
      {
        closeOnEose: false,
      }
    );

    sub.addListener('event', (event) => {
      console.log(event);
    });

    return () => {
      sub.stop();
    };
  }, [pubkey]);

  return (
    <div className="grid h-full w-full grid-cols-3 bg-white/10 backdrop-blur-xl">
      <div className="col-span-2 border-r border-white/5">
        <div className="h-full w-full flex-1 p-3">
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl">
            <div className="h-full w-full flex-1">
              {status === 'loading' ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <LoaderIcon className="h-5 w-5 animate-spin text-white" />
                    <p className="text-sm font-medium text-white/50">Loading messages</p>
                  </div>
                </div>
              ) : data.length === 0 ? (
                <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col gap-1 text-center">
                  <h3 className="mb-2 text-4xl">🙌</h3>
                  <p className="leading-none text-white/50">
                    You two didn&apos;t talk yet, let&apos;s send first message
                  </p>
                </div>
              ) : (
                <VList ref={listRef} className="scrollbar-hide h-full" mode="reverse">
                  {data.map((message) => renderItem(message))}
                </VList>
              )}
            </div>
            <div className="z-50 shrink-0 rounded-b-xl border-t border-white/5 bg-white/10 p-3 px-5 backdrop-blur-xl">
              <ChatMessageForm
                receiverPubkey={pubkey}
                userPubkey={db.account.pubkey}
                userPrivkey={userPrivkey}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
