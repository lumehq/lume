import * as Dialog from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { relaunch } from '@tauri-apps/plugin-process';

import { CancelIcon, LogoutIcon } from '@shared/icons';

export function Logout() {
  const queryClient = useQueryClient();

  const logout = async () => {
    // reset database
    // await removeAll();
    // reset react query
    queryClient.clear();
    // navigate
    await relaunch();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Logout"
          className="inline-flex h-9 w-9 transform items-center justify-center rounded-md bg-white/20 active:translate-y-1"
        >
          <LogoutIcon className="h-4 w-4 text-white" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10">
            <div className="h-min w-full shrink-0 border-b border-white/10 bg-white/5 px-5 py-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-white">
                    Are you sure!
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-white/50" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="text-sm leading-tight text-white/50">
                  <p className="mb-2">
                    When logout, all local data will be wiped, and restart app then you
                    need to start onboarding process again when you log in.
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
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-white/50 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-3 text-sm font-medium text-white hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
