import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '@app/auth/components/user';

import { CancelIcon, LoaderIcon, PlusIcon } from '@shared/icons';

import { useAccount } from '@utils/hooks/useAccount';

export function NewMessageModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { status, account } = useAccount();
  const follows = account ? JSON.parse(account.follows) : [];

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const openChat = (pubkey: string) => {
    closeModal();
    navigate(`/app/chat/${pubkey}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className="inline-flex h-9 items-center gap-2.5 rounded-md px-2.5"
      >
        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border-t border-zinc-800/50 bg-zinc-900">
          <PlusIcon className="h-3 w-3 text-zinc-200" />
        </div>
        <div>
          <h5 className="font-medium text-zinc-400">New chat</h5>
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
                        New chat
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-900"
                      >
                        <CancelIcon width={20} height={20} className="text-zinc-300" />
                      </button>
                    </div>
                    <Dialog.Description className="text-sm leading-tight text-zinc-400">
                      All messages will be encrypted, but anyone can see who you chat
                    </Dialog.Description>
                  </div>
                </div>
                <div className="flex h-[500px] flex-col overflow-y-auto overflow-x-hidden pb-5">
                  {status === 'loading' ? (
                    <div className="inline-flex items-center justify-center px-4 py-3">
                      <LoaderIcon className="h-5 w-5 animate-spin text-black dark:text-zinc-100" />
                    </div>
                  ) : (
                    follows.map((follow) => (
                      <div
                        key={follow}
                        className="group flex items-center justify-between px-4 py-3 hover:bg-zinc-800"
                      >
                        <User pubkey={follow} />
                        <div>
                          <button
                            type="button"
                            onClick={() => openChat(follow)}
                            className="inline-flex w-max translate-x-20 transform rounded border-t border-zinc-600/50 bg-zinc-700 px-3 py-1.5 text-sm transition-transform duration-150 ease-in-out hover:bg-fuchsia-500 group-hover:translate-x-0"
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
