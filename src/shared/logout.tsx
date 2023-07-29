import { Dialog, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { relaunch } from '@tauri-apps/plugin-process';
import { Fragment, useState } from 'react';

import { removeAll } from '@libs/storage';

import { CancelIcon, LogoutIcon } from '@shared/icons';

export function Logout() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const logout = async () => {
    // reset database
    await removeAll();
    // reset react query
    queryClient.clear();
    // navigate
    await relaunch();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        aria-label="Logout"
        className="inline-flex h-9 w-9 transform items-center justify-center rounded-md border-t border-zinc-700/50 bg-zinc-800 active:translate-y-1"
      >
        <LogoutIcon className="h-4 w-4 text-zinc-400" />
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
              <Dialog.Panel className="relative flex h-min w-full max-w-lg flex-col rounded-xl border-t border-zinc-800/50 bg-zinc-900">
                <div className="h-min w-full shrink-0 border-b border-zinc-800 px-5 py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-none text-zinc-100"
                      >
                        Are you sure!
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
                      <p className="mb-2">
                        When logout, all local data will be wiped, and restart app then
                        you need to start onboarding process again when you log in.
                      </p>
                      <p>
                        In the next version, Lume will support multi account, then you can
                        switch between all account s instead of logout
                      </p>
                    </Dialog.Description>
                  </div>
                </div>
                <div className="flex h-full w-full flex-col items-end justify-center overflow-y-auto px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-3 text-sm font-medium text-zinc-100 hover:bg-red-600"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
