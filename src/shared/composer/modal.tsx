import { Post } from '@lume/shared/composer/types/post';
import { User } from '@lume/shared/composer/user';
import CancelIcon from '@lume/shared/icons/cancel';
import ChevronDownIcon from '@lume/shared/icons/chevronDown';
import ChevronRightIcon from '@lume/shared/icons/chevronRight';
import ComposeIcon from '@lume/shared/icons/compose';
import { composerAtom } from '@lume/stores/composer';
import { useActiveAccount } from '@lume/utils/hooks/useActiveAccount';

import { Dialog, Transition } from '@headlessui/react';
import { useAtom } from 'jotai';
import { Fragment, useState } from 'react';

import PlusCircleIcon from '../icons/plusCircle';

export function ComposerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [composer] = useAtom(composerAtom);

  const { account, isLoading, isError } = useActiveAccount();

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => openModal()}
        className="inline-flex h-7 w-max items-center justify-center gap-1 rounded-md bg-fuchsia-500 px-2.5 text-xs font-medium text-zinc-200 shadow-button hover:bg-fuchsia-600"
      >
        <ComposeIcon width={14} height={14} />
        Compose
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
            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-md data-[state=open]:animate-overlayShow" />
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
              <Dialog.Panel className="relative h-min w-full max-w-xl rounded-lg border border-zinc-800 bg-zinc-900">
                <div className="flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div>{!isLoading && !isError && account && <User data={account} />}</div>
                    <span>
                      <ChevronRightIcon width={14} height={14} className="text-zinc-500" />
                    </span>
                    <button
                      autoFocus={false}
                      className="inline-flex h-6 w-max items-center justify-center gap-0.5 rounded bg-zinc-800 pl-3 pr-1.5 text-xs font-medium text-zinc-400 shadow-mini-button"
                    >
                      Post
                      <ChevronDownIcon width={14} height={14} />
                    </button>
                  </div>
                  <div>
                    <CancelIcon width={16} height={16} className="text-zinc-500" />
                  </div>
                </div>
                <div className="flex h-full flex-col px-4 pb-4">
                  <div className="flex h-full w-full gap-2">
                    <div className="flex w-8 shrink-0 items-center justify-center">
                      <div className="h-full w-[2px] bg-zinc-800"></div>
                    </div>
                    {composer.type === 'post' && <Post />}
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded">
                      <PlusCircleIcon width={20} height={20} className="text-zinc-500" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-7 w-max items-center justify-center gap-1 rounded-md bg-fuchsia-500 px-3.5 text-xs font-medium text-zinc-200 shadow-button hover:bg-fuchsia-600"
                    >
                      Post
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
