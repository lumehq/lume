import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Button } from '@shared/button';
import { Composer, ComposerUser } from '@shared/composer';
import {
  CancelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ComposeIcon,
} from '@shared/icons';

import { useComposer } from '@stores/composer';
import { COMPOSE_SHORTCUT } from '@stores/shortcuts';

import { useAccount } from '@utils/hooks/useAccount';

export function ComposerModal() {
  const { account } = useAccount();
  const [toggle, open] = useComposer((state) => [state.toggleModal, state.open]);

  const closeModal = () => {
    toggle(false);
  };

  useHotkeys(COMPOSE_SHORTCUT, () => toggle(true));

  return (
    <>
      <Button onClick={() => toggle(true)} preset="small">
        <ComposeIcon className="h-4 w-4" />
        Compose
      </Button>
      <Transition appear show={open} as={Fragment}>
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
              <Dialog.Panel className="relative h-min w-full max-w-xl rounded-xl border-t border-zinc-800/50 bg-zinc-900">
                <div className="flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-2">
                    {account && <ComposerUser pubkey={account.pubkey} />}
                    <span>
                      <ChevronRightIcon
                        width={14}
                        height={14}
                        className="text-zinc-500"
                      />
                    </span>
                    <div className="inline-flex h-7 w-max items-center justify-center gap-0.5 rounded bg-zinc-800 pl-3 pr-1.5 text-sm font-medium text-zinc-400">
                      New Post
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800"
                  >
                    <CancelIcon width={16} height={16} className="text-zinc-500" />
                  </button>
                </div>
                <Composer />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
