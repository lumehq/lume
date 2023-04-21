import { ChatModalUser } from '@components/chats/chatModalUser';

import { getPlebs } from '@utils/storage';

import * as Dialog from '@radix-ui/react-dialog';
import { Cancel, Plus } from 'iconoir-react';
import { useEffect, useState } from 'react';

export const ChatModal = () => {
  const [plebs, setPlebs] = useState([]);

  useEffect(() => {
    getPlebs()
      .then((res: any) => setPlebs(res))
      .catch(console.error);
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="group inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900">
          <div className="group-hover:800 inline-flex h-5 w-5 shrink items-center justify-center rounded bg-zinc-900 group-hover:bg-zinc-800">
            <Plus width={12} height={12} className="text-zinc-500" />
          </div>
          <div>
            <h5 className="text-sm font-medium text-zinc-500 group-hover:text-zinc-400">Add a new chat</h5>
          </div>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <div className="relative flex h-[500px] w-full max-w-2xl flex-col rounded-lg bg-zinc-900 text-zinc-100 ring-1 ring-zinc-800">
              <div className="sticky left-0 top-0 flex h-12 w-full shrink-0 items-center justify-between rounded-t-lg border-b border-zinc-800 bg-zinc-950 px-3">
                <div className="flex items-center gap-2">
                  <Dialog.Close asChild>
                    <button
                      autoFocus={false}
                      className="inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-900"
                    >
                      <Cancel width={12} height={12} className="text-zinc-300" />
                    </button>
                  </Dialog.Close>
                  <h5 className="font-semibold leading-none text-zinc-500">New chat</h5>
                </div>
              </div>
              <div className="flex flex-col overflow-y-auto">
                {plebs.map((pleb) => (
                  <ChatModalUser key={pleb.id} data={pleb} />
                ))}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
