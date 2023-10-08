import { NDKEvent, NDKSubscription } from '@nostr-dev-kit/ndk';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { VList, VListHandle } from 'virtua';

import { ChatForm } from '@app/chats/components/chatForm';
import { ChatMessage } from '@app/chats/components/message';

import { useNDK } from '@libs/ndk/provider';
import { useStorage } from '@libs/storage/provider';

import { LoaderIcon } from '@shared/icons';
import { User } from '@shared/user';

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
        <ChatMessage
          message={message}
          userPubkey={db.account.pubkey}
          userPrivkey={userPrivkey}
          self={message.pubkey === db.account.pubkey}
        />
      );
    },
    [data]
  );

  useEffect(() => {
    if (data && data.length > 0) listRef.current?.scrollToIndex(data.length);
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
    <div className="h-full w-full p-3">
      <div className="rounded-lg bg-zinc-100 backdrop-blur-xl dark:bg-zinc-900">
        <div className="flex h-full flex-col justify-between overflow-hidden">
          <div className="flex h-16 shrink-0 items-center border-b border-zinc-200 px-3 dark:border-zinc-800">
            <User pubkey={pubkey} variant="simple" />
          </div>
          <div className="h-full w-full flex-1 px-3 py-3">
            {status === 'loading' ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-1.5">
                  <LoaderIcon className="h-5 w-5 animate-spin text-zinc-900 dark:text-zinc-100" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-300">
                    Loading messages
                  </p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col gap-1 text-center">
                <h3 className="mb-2 text-4xl">🙌</h3>
                <p className="leading-none text-zinc-500 dark:text-zinc-300">
                  You two didn&apos;t talk yet, let&apos;s send first message
                </p>
              </div>
            ) : (
              <VList ref={listRef} className="scrollbar-hide h-full" mode="reverse">
                {data.map((message) => renderItem(message))}
              </VList>
            )}
          </div>
          <div className="shrink-0 rounded-b-lg border-t border-zinc-300 bg-zinc-200 p-3 backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-800">
            <ChatForm
              receiverPubkey={pubkey}
              userPubkey={db.account.pubkey}
              userPrivkey={userPrivkey}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
