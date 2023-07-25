import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '@app/auth/components/user';

import { CancelIcon, StrangersIcon } from '@shared/icons';

import { compactNumber } from '@utils/number';
import { Chats } from '@utils/types';

export function UnknownsModal({ data }: { data: Chats[] }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const openChat = (pubkey: string) => {
    closeModal();
    navigate(`/app/chats/${pubkey}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5"
      >
        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
          <StrangersIcon className="h-3 w-3 text-zinc-200" />
        </div>
        <div>
          <h5 className="font-medium text-zinc-400">
            {compactNumber.format(data.length)} unknowns
          </h5>
        </div>
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-md" />
          </Transition.Child>
          <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border-t border-zinc-800/50 bg-zinc-900">
                <div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-none text-zinc-100"
                      >
                        {data.length} unknowns
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800"
                      >
                        <CancelIcon className="h-4 w-4 text-zinc-300" />
                      </button>
                    </div>
                    <Dialog.Description className="text-sm leading-tight text-zinc-400">
                      All messages from people you not follow
                    </Dialog.Description>
                  </div>
                </div>
                <div className="flex h-[500px] flex-col overflow-y-auto overflow-x-hidden pb-5">
                  {data.map((user) => (
                    <div
                      key={user.event_id}
                      className="group flex items-center justify-between px-4 py-3 hover:bg-zinc-800"
                    >
                      <User pubkey={user.sender_pubkey} />
                      <div>
                        <button
                          type="button"
                          onClick={() => openChat(user.sender_pubkey)}
                          className="hidden w-max rounded-md bg-zinc-700 px-3 py-1 text-sm font-medium hover:bg-fuchsia-500 group-hover:inline-flex"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
