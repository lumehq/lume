/* eslint-disable @typescript-eslint/no-explicit-any */
import Reaction from '@components/note/atoms/reaction';
import Reply from '@components/note/atoms/reply';
import { User } from '@components/note/atoms/user';
import Content from '@components/note/content';

import * as Dialog from '@radix-ui/react-dialog';
import dynamic from 'next/dynamic';
import { memo } from 'react';

const Modal = dynamic(() => import('@components/note/modal'), {
  ssr: false,
  loading: () => <></>,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Single = memo(function Single({ event }: { event: any }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="flex h-min min-h-min w-full cursor-pointer select-text flex-col border-b border-zinc-800 py-4 px-6 hover:bg-zinc-800">
          <div className="flex flex-col">
            <User pubkey={event.pubkey} time={event.created_at} />
            <div className="-mt-4 pl-[60px]">
              <div className="flex flex-col gap-6">
                <Content data={event.content} />
                <div className="relative z-10 -ml-1 flex items-center gap-8">
                  <Reply eventID={event.id} />
                  <Reaction eventID={event.id} eventPubkey={event.pubkey} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed inset-0 overflow-y-auto">
          <Modal event={event} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
