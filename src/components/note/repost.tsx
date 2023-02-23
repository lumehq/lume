/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRepost } from '@components/note/atoms/userRepost';
import Content from '@components/note/content';
import { Placeholder } from '@components/note/placeholder';

import RepostIcon from '@assets/icons/Repost';

import * as Dialog from '@radix-ui/react-dialog';
import dynamic from 'next/dynamic';
import { useNostrEvents } from 'nostr-react';
import { memo } from 'react';

const Modal = dynamic(() => import('@components/note/modal'), {
  ssr: false,
  loading: () => <></>,
});

export const Repost = memo(function Repost({ root, user }: { root: any; user: string }) {
  const { events } = useNostrEvents({
    filter: {
      ids: [root[0][1]],
      since: 0,
      kinds: [1],
    },
  });

  if (events !== null) {
    return (
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="flex h-min min-h-min w-full select-text flex-col border-b border-zinc-800 py-6 px-6">
            <div className="flex items-center gap-1 pl-8 text-sm">
              <RepostIcon className="h-4 w-4 text-zinc-400" />
              <div className="ml-2">
                <UserRepost pubkey={user} />
              </div>
            </div>
            <Content data={events[0]} />
          </div>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed inset-0 overflow-y-auto">
              <Modal event={events[0]} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Trigger>
      </Dialog.Root>
    );
  } else {
    return (
      <div className="border-b border-zinc-800">
        <Placeholder />
      </div>
    );
  }
});
