/* eslint-disable @typescript-eslint/no-explicit-any */
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
  console.log(event);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="flex h-min min-h-min w-full cursor-pointer select-text flex-col border-b border-zinc-800 py-4 px-6 hover:bg-zinc-800">
          <Content data={event} />
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
