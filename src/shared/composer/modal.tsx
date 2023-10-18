import * as Dialog from '@radix-ui/react-dialog';

import { useStorage } from '@libs/storage/provider';

import { Composer, ComposerUser } from '@shared/composer';
import {
  CancelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ComposeIcon,
} from '@shared/icons';

import { useComposer } from '@stores/composer';

export function ComposerModal() {
  const { db } = useStorage();
  const [toggleModal, open] = useComposer((state) => [state.toggleModal, state.open]);

  return (
    <Dialog.Root open={open} onOpenChange={toggleModal}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex aspect-square h-auto w-full items-center justify-center rounded-lg bg-neutral-100 text-black hover:bg-blue-500 hover:text-white dark:bg-neutral-900 dark:text-white dark:hover:bg-blue-500"
        >
          <ComposeIcon className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xl dark:bg-white/50" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-2xl rounded-xl bg-white dark:bg-black">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <ComposerUser pubkey={db.account.pubkey} />
                <ChevronRightIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <div className="inline-flex h-7 w-max items-center justify-center gap-0.5 rounded bg-neutral-200 pl-3 pr-1.5 text-sm font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                  New Post
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-200 hover:text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-400">
                <CancelIcon className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <Composer />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
