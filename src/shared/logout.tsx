import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useNavigate } from 'react-router-dom';

import { useStorage } from '@libs/storage/provider';

import { LogoutIcon } from '@shared/icons';

export function Logout() {
  const { db } = useStorage();

  const navigate = useNavigate();

  const logout = async () => {
    // remove account
    db.accountLogout();
    // redirect to welcome screen
    navigate('/auth/welcome');
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-r-lg hover:bg-white/10"
        >
          <LogoutIcon className="h-5 w-5 text-white" />
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl" />
        <AlertDialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-md rounded-xl bg-white/10 backdrop-blur-xl">
            <div className="flex flex-col gap-2 border-b border-white/5 px-5 py-4">
              <AlertDialog.Title className="text-lg font-semibold leading-none text-white">
                Are you sure!
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm leading-tight text-white/50">
                You can always log back in at any time. If you just want to switch
                accounts, you can do that by adding an existing account.
              </AlertDialog.Description>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3">
              <AlertDialog.Cancel asChild>
                <button className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium leading-none text-white outline-none hover:bg-white/10 hover:backdrop-blur-xl">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex h-9 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-medium leading-none text-white outline-none hover:bg-blue-600"
              >
                Logout
              </button>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
