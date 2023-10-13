import * as Dialog from '@radix-ui/react-dialog';
import { twMerge } from 'tailwind-merge';

import { useStorage } from '@libs/storage/provider';

import { Composer, ComposerUser } from '@shared/composer';
import {
  CancelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ComposeIcon,
  ExpandIcon,
} from '@shared/icons';

import { useComposer } from '@stores/composer';

export function ComposerModal() {
  const { db } = useStorage();

  const [toggleModal, open] = useComposer((state) => [state.toggleModal, state.open]);
  const [toggleExpand, expand] = useComposer((state) => [
    state.toggleExpand,
    state.expand,
  ]);

  return (
    <Dialog.Root open={open} onOpenChange={toggleModal}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex aspect-square h-auto w-full items-center justify-center rounded-lg bg-neutral-300 text-black hover:bg-blue-600 hover:text-white dark:bg-neutral-700 dark:text-white dark:hover:bg-blue-600"
        >
          <ComposeIcon className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-white dark:bg-black" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div
            className={twMerge(
              'relative h-min w-full rounded-xl bg-neutral-100 dark:bg-neutral-900',
              expand ? 'max-w-4xl' : 'max-w-2xl'
            )}
          >
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <ComposerUser pubkey={db.account.pubkey} />
                <ChevronRightIcon className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
                <div className="inline-flex h-7 w-max items-center justify-center gap-0.5 rounded bg-neutral-200 pl-3 pr-1.5 text-sm font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                  New Post
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpand()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-400"
                >
                  <ExpandIcon className="h-5 w-5" />
                </button>
                <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-400">
                  <CancelIcon className="h-5 w-5" />
                </Dialog.Close>
              </div>
            </div>
            <Composer />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
