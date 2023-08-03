import { NDKSubscription } from '@nostr-dev-kit/ndk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { ChatMessageForm } from '@app/chats/components/messages/form';
import { ChatMessageItem } from '@app/chats/components/messages/item';
import { ChatSidebar } from '@app/chats/components/sidebar';

import { useNDK } from '@libs/ndk/provider';
import { createChat, getChatMessages } from '@libs/storage';

import { useStronghold } from '@stores/stronghold';

import { useAccount } from '@utils/hooks/useAccount';

export function ChatScreen() {
  const queryClient = useQueryClient();
  const virtuosoRef = useRef(null);

  const { ndk } = useNDK();
  const { pubkey } = useParams();
  const { account } = useAccount();
  const { status, data } = useQuery(
    ['chat', pubkey],
    async () => {
      return await getChatMessages(account.pubkey, pubkey);
    },
    {
      enabled: account ? true : false,
    }
  );

  const userPrivkey = useStronghold((state) => state.privkey);

  const itemContent: any = useCallback(
    (index: string | number) => {
      return (
        <ChatMessageItem
          data={data[index]}
          userPubkey={account.pubkey}
          userPrivkey={userPrivkey}
        />
      );
    },
    [data]
  );

  const computeItemKey = useCallback(
    (index: string | number) => {
      return data[index].id;
    },
    [data]
  );

  const chat = useMutation({
    mutationFn: (data: any) => {
      return createChat(
        data.id,
        data.receiver_pubkey,
        data.sender_pubkey,
        data.content,
        data.tags,
        data.created_at
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', pubkey] });
    },
  });

  useEffect(() => {
    const sub: NDKSubscription = ndk.subscribe(
      {
        kinds: [4],
        authors: [account.pubkey],
        '#p': [pubkey],
        since: Math.floor(Date.now() / 1000),
      },
      {
        closeOnEose: false,
      }
    );

    sub.addListener('event', (event) => {
      chat.mutate({
        id: event.id,
        receiver_pubkey: pubkey,
        sender_pubkey: event.pubkey,
        content: event.content,
        tags: event.tags,
        created_at: event.created_at,
      });
    });

    return () => {
      sub.stop();
    };
  }, [pubkey]);

  return (
    <div className="grid h-full w-full grid-cols-3">
      <div className="col-span-2 flex flex-col justify-between border-r border-zinc-900">
        <div
          data-tauri-drag-region
          className="inline-flex h-11 w-full shrink-0 items-center justify-center border-b border-zinc-900"
        >
          <h3 className="font-semibold text-white">Encrypted Chat</h3>
        </div>
        <div className="h-full w-full flex-1 p-3">
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border-t border-zinc-800/50 bg-zinc-900">
            <div className="h-full w-full flex-1">
              {status === 'loading' ? (
                <p>Loading...</p>
              ) : (
                <Virtuoso
                  ref={virtuosoRef}
                  data={data}
                  itemContent={itemContent}
                  computeItemKey={computeItemKey}
                  initialTopMostItemIndex={data.length - 1}
                  alignToBottom={true}
                  followOutput={true}
                  overscan={50}
                  increaseViewportBy={{ top: 200, bottom: 200 }}
                  className="scrollbar-hide relative overflow-y-auto"
                  components={{
                    EmptyPlaceholder: () => Empty,
                  }}
                />
              )}
            </div>
            <div className="z-50 shrink-0 rounded-b-xl border-t border-zinc-800 bg-zinc-900 p-3 px-5">
              <ChatMessageForm
                receiverPubkey={pubkey}
                userPubkey={account.pubkey}
                userPrivkey={userPrivkey}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <div
          data-tauri-drag-region
          className="inline-flex h-11 w-full shrink-0 items-center justify-center border-b border-zinc-900"
        />
        <ChatSidebar pubkey={pubkey} />
      </div>
    </div>
  );
}

const Empty = (
  <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col gap-1 text-center">
    <h3 className="mb-2 text-4xl">🙌</h3>
    <p className="leading-none text-white/50">
      You two didn&apos;t talk yet, let&apos;s send first message
    </p>
  </div>
);
