import { webln } from '@getalby/sdk';
import * as Dialog from '@radix-ui/react-dialog';
import { message } from '@tauri-apps/api/dialog';
import { WebviewWindow } from '@tauri-apps/api/window';
import { useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import {
  AlbyIcon,
  ArrowRightCircleIcon,
  CancelIcon,
  LoaderIcon,
  StarsIcon,
} from '@shared/icons';

export function AlbyConnectButton() {
  const { db } = useStorage();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const initAlby = async () => {
    try {
      setIsloading(true);

      const provider = webln.NostrWebLNProvider.withNewSecret();
      const walletConnectURL = provider.getNostrWalletConnectUrl(true);

      // get auth url
      const authURL = provider.getAuthorizationUrl({ name: 'Lume' });

      // open auth window
      const webview = new WebviewWindow('alby', {
        title: 'Connect Alby',
        url: authURL.href,
        center: true,
        theme: 'light',
        width: 400,
        height: 650,
      });

      webview.listen('tauri://close-requested', async (e) => {
        console.log(e);
        await db.secureSave('wallet-connect-url', walletConnectURL);
        setIsloading(false);
        webview.close();
      });
    } catch (e) {
      setIsloading(false);
      await message(e.toString(), { title: 'Connect Alby', type: 'error' });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative w-full rounded-xl bg-gradient-to-r from-orange-400 via-red-200 to-yellow-200 p-px">
        <StarsIcon className="absolute -left-4 -top-3 z-50 h-10 w-10 text-white" />
        <div className="flex w-full flex-col rounded-xl bg-white/10 backdrop-blur-xl">
          <div className="absolute right-2 top-2">
            <button type="button">
              <CancelIcon className="h-4 w-4 text-black/50" />
            </button>
          </div>
          <div className="flex h-14 w-full flex-col items-center justify-center">
            <h5 className="text-center text-sm font-semibold leading-tight text-black/50">
              New feature
            </h5>
            <h3 className="transform font-medium leading-tight text-black">
              Send bitcoin tip with Alby
            </h3>
          </div>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-1 rounded-b-xl border-t border-orange-200 bg-white text-sm font-semibold text-orange-400 hover:bg-orange-50"
            >
              Connect your Alby account <AlbyIcon className="h-7 w-7" />
            </button>
          </Dialog.Trigger>
        </div>
      </div>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10 backdrop-blur-xl">
            <div className="h-min w-full shrink-0 border-b border-white/10 bg-white/5 px-5 py-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold leading-none text-white">
                    Alby integration (Beta)
                  </Dialog.Title>
                  <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md backdrop-blur-xl hover:bg-white/10">
                    <CancelIcon className="h-4 w-4 text-white/50" />
                  </Dialog.Close>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 px-5 py-5">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-white/50">
                  When you click &quot;Connect&quot;, a new window will open in your
                  default browser. You will need to click the &quot;Connect Wallet&quot;
                  button to grant Lume permission to integrate with your Alby account.
                </p>
                <p className="text-sm text-white/50">
                  All information will be encrypted and stored on the local machine.
                </p>
              </div>
              <button
                type="button"
                onClick={() => initAlby()}
                className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg bg-fuchsia-500 px-6 font-medium leading-none text-white hover:bg-fuchsia-600 focus:outline-none disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-5" />
                    <span>Connecting...</span>
                    <LoaderIcon className="h-5 w-5 animate-spin text-white" />
                  </>
                ) : (
                  <>
                    <span className="w-5" />
                    <span>Connect</span>
                    <ArrowRightCircleIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
