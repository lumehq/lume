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
import { useStorage } from '@libs/storage/provider';

import { useStronghold } from '@stores/stronghold';

import { Chats } from '@utils/types';

export function ChatScreen() {
  const queryClient = useQueryClient();
  const virtuosoRef = useRef(null);

  const { ndk } = useNDK();
  const { db } = useStorage();
  const { pubkey } = useParams();
  const { status, data } = useQuery(['chat', pubkey], async () => {
    return await getChatMessages(db.account.pubkey, pubkey);
  });

  const userPrivkey = useStronghold((state) => state.privkey);

  const itemContent = useCallback(
    (index: string | number) => {
      return (
        <ChatMessageItem
          data={data[index]}
          userPubkey={db.account.pubkey}
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
    mutationFn: (data: Chats) => {
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
        authors: [db.account.pubkey],
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
    <div className="grid h-full w-full grid-cols-3 bg-white/10">
      <div className="col-span-2 border-r border-white/5">
        <div className="h-full w-full flex-1 p-3">
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white/10">
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
            <div className="z-50 shrink-0 rounded-b-xl border-t border-white/5 bg-white/10 p-3 px-5">
              <ChatMessageForm
                receiverPubkey={pubkey}
                userPubkey={db.account.pubkey}
                userPrivkey={userPrivkey}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 pt-3">
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
