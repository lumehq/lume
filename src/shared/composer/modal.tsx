import * as Dialog from '@radix-ui/react-dialog';
import { useHotkeys } from 'react-hotkeys-hook';

import { useStorage } from '@libs/storage/provider';

import { Composer, ComposerUser } from '@shared/composer';
import {
  CancelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ComposeIcon,
} from '@shared/icons';

import { useComposer } from '@stores/composer';
import { COMPOSE_SHORTCUT } from '@stores/shortcuts';

export function ComposerModal() {
  const { db } = useStorage();
  const [toggle, open] = useComposer((state) => [state.toggleModal, state.open]);

  useHotkeys(COMPOSE_SHORTCUT, () => toggle(true));

  return (
    <Dialog.Root open={open} onOpenChange={toggle}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-min items-center justify-center gap-1 rounded-md bg-white/10 px-8 text-sm font-medium text-white hover:bg-fuchsia-500 focus:outline-none active:translate-y-1 disabled:pointer-events-none disabled:opacity-50"
        >
          <ComposeIcon className="h-4 w-4" />
          Postr
        </button>
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-2xl rounded-xl bg-white/10">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <ComposerUser pubkey={db.account.pubkey} />
                <span>
                  <ChevronRightIcon className="h-4 w-4 text-white/50" />
                </span>
                <div className="inline-flex h-7 w-max items-center justify-center gap-0.5 rounded bg-white/10 pl-3 pr-1.5 text-sm font-medium text-white">
                  New Postr
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
              <Dialog.Close
                onClick={() => toggle(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-800"
              >
                <CancelIcon className="h-5 w-5 text-white/50" />
              </Dialog.Close>
            </div>
            <Composer />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
