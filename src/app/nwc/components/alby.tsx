import { webln } from '@getalby/sdk';
import * as Dialog from '@radix-ui/react-dialog';
import { message } from '@tauri-apps/plugin-dialog';
import { WebviewWindow } from '@tauri-apps/plugin-window';
import { useState } from 'react';

import { useStorage } from '@libs/storage/provider';

import {
  AlbyIcon,
  ArrowRightCircleIcon,
  CancelIcon,
  CheckCircleIcon,
  LoaderIcon,
} from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

export function NWCAlby() {
  const { db } = useStorage();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const setWalletConnectURL = useStronghold((state) => state.setWalletConnectURL);

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
        width: 400,
        height: 650,
      });

      webview.listen('tauri://close-requested', async () => {
        await db.secureSave('walletConnectURL', walletConnectURL, 'nwc');
        setWalletConnectURL(walletConnectURL);
        setIsConnected(true);
        setIsloading(false);
      });
    } catch (e) {
      setIsloading(false);
      await message(e.toString(), { title: 'Connect Alby', type: 'error' });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-orange-200">
            <AlbyIcon className="h-8 w-8" />
          </div>
          <div>
            <h5 className="font-semibold leading-tight text-white">Alby</h5>
            <p className="text-sm leading-tight text-white/50">Require alby account</p>
          </div>
        </div>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-9 w-min items-center justify-center rounded-md border-t border-white/10 bg-white/20 px-3 text-sm font-medium text-white hover:bg-green-500"
          >
            Connect
          </button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10 backdrop-blur-xl">
            <div className="h-min w-full shrink-0 rounded-t-xl border-b border-white/10 bg-white/5 px-5 py-5">
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
              <div className="relative flex h-40 items-center justify-center gap-4">
                <div className="inline-flex h-16 w-16 items-end justify-center rounded-lg bg-black pb-2">
                  <img src="/lume.png" className="w-1/3" alt="Lume Logo" />
                </div>
                <div className="w-20 border border-dashed border-white/5" />
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-white">
                  <AlbyIcon className="h-8 w-8" />
                </div>
                {isConnected ? (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-white/50">
                  When you click &quot;Connect&quot;, a new window will open and you need
                  to click the &quot;Connect Wallet&quot; button to grant Lume permission
                  to integrate with your Alby account.
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
                ) : isConnected ? (
                  <>
                    <span className="w-5" />
                    <span>Connected</span>
                    <CheckCircleIcon className="h-5 w-5" />
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
