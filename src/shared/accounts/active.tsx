import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useNDK } from '@libs/ndk/provider';
import { createChat, getLastLogin } from '@libs/storage';

import { Image } from '@shared/image';
import { NetworkStatusIndicator } from '@shared/networkStatusIndicator';

import { DEFAULT_AVATAR } from '@stores/constants';

import { useProfile } from '@utils/hooks/useProfile';
import { sendNativeNotification } from '@utils/notification';

const lastLogin = await getLastLogin();

export function ActiveAccount({ data }: { data: { pubkey: string; npub: string } }) {
  const queryClient = useQueryClient();

  const { ndk } = useNDK();
  const { status, user } = useProfile(data.pubkey);

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
    onSuccess: (data: any) => {
      const prev = queryClient.getQueryData(['chats']);
      const next = produce(prev, (draft: any) => {
        const target = draft.findIndex(
          (m: { sender_pubkey: string }) => m.sender_pubkey === data
        );
        if (target !== -1) {
          draft[target]['new_messages'] = draft[target]['new_messages'] + 1 || 1;
        } else {
          draft.push({ sender_pubkey: data, new_messages: 1 });
        }
      });
      queryClient.setQueryData(['chats'], next);
    },
  });

  useEffect(() => {
    const since = lastLogin > 0 ? lastLogin : Math.floor(Date.now() / 1000);
    const sub = ndk.subscribe(
      {
        kinds: [4],
        '#p': [data.pubkey],
        since: since,
      },
      {
        closeOnEose: false,
      }
    );

    sub.addListener('event', (event) => {
      switch (event.kind) {
        case 4:
          // update state
          chat.mutate({
            id: event.id,
            receiver_pubkey: data.pubkey,
            sender_pubkey: event.pubkey,
            content: event.content,
            tags: event.tags,
            created_at: event.created_at,
          });
          // send native notifiation
          sendNativeNotification("You've received new message");
          break;
        default:
          break;
      }
    });

    return () => {
      sub.stop();
    };
  }, []);

  if (status === 'loading') {
    return <div className="h-9 w-9 animate-pulse rounded-md bg-zinc-800" />;
  }

  return (
    <Link to={`/app/users/${data.pubkey}`} className="relative inline-block h-9 w-9">
      <Image
        src={user?.picture || user?.image}
        fallback={DEFAULT_AVATAR}
        alt={data.npub}
        className="h-9 w-9 rounded-md object-cover"
      />
      <NetworkStatusIndicator />
    </Link>
  );
}
