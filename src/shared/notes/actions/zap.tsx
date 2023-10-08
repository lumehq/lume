import { webln } from '@getalby/sdk';
import { SendPaymentResponse } from '@getalby/sdk/dist/types';
import * as Dialog from '@radix-ui/react-dialog';
import { message } from '@tauri-apps/plugin-dialog';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

import { CancelIcon, ZapIcon } from '@shared/icons';

import { useStronghold } from '@stores/stronghold';

import { useEvent } from '@utils/hooks/useEvent';
import { useNostr } from '@utils/hooks/useNostr';
import { useProfile } from '@utils/hooks/useProfile';
import { sendNativeNotification } from '@utils/notification';
import { compactNumber } from '@utils/number';

export function NoteZap({ id, pubkey }: { id: string; pubkey: string }) {
  const { createZap } = useNostr();
  const { user } = useProfile(pubkey);
  const { data: event } = useEvent(id);

  const [amount, setAmount] = useState<string>('21');
  const [zapMessage, setZapMessage] = useState<string>('');
  const [invoice, setInvoice] = useState<null | string>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const walletConnectURL = useStronghold((state) => state.walletConnectURL);
  const nwc = useRef(null);

  const createZapRequest = async () => {
    try {
      const zapAmount = parseInt(amount) * 1000;
      const res = await createZap(event, zapAmount, zapMessage);

      if (!res)
        return await message('Cannot create zap request', {
          title: 'Zap',
          type: 'error',
        });

      // user don't connect nwc, create QR Code for invoice
      if (!walletConnectURL) return setInvoice(res);

      // user connect nwc
      nwc.current = new webln.NostrWebLNProvider({
        nostrWalletConnectUrl: walletConnectURL,
      });
      await nwc.current.enable();

      // start loading
      setIsLoading(true);
      // send payment via nwc
      const send: SendPaymentResponse = await nwc.current.sendPayment(res);

      if (send) {
        await sendNativeNotification(
          `You've tipped ${compactNumber.format(send.amount)} sats to ${
            user?.name || user?.display_name || user?.displayName
          }`
        );

        // eose
        nwc.current.close();
        setIsCompleted(true);
        setIsLoading(false);

        // reset after 3 secs
        const timeout = setTimeout(() => setIsCompleted(false), 3000);
        clearTimeout(timeout);
      }
    } catch (e) {
      nwc.current.close();
      setIsLoading(false);
      await message(JSON.stringify(e), { title: 'Zap', type: 'error' });
    }
  };

  useEffect(() => {
    return () => {
      setAmount('21');
      setZapMessage('');
      setIsCompleted(false);
      setIsLoading(false);
    };
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group inline-flex h-7 w-7 items-center justify-center text-zinc-500 dark:text-zinc-300"
        >
          <ZapIcon className="h-5 w-5 group-hover:text-orange-400" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white/10 backdrop-blur-xl">
            <div className="inline-flex w-full shrink-0 items-center justify-between px-5 py-3">
              <div className="w-6" />
              <Dialog.Title className="text-center text-sm font-semibold leading-none text-white">
                Send tip to {user?.name || user?.display_name || user?.displayName}
              </Dialog.Title>
              <Dialog.Close className="inline-flex h-6 w-6 items-center justify-center rounded-md backdrop-blur-xl hover:bg-white/10">
                <CancelIcon className="h-4 w-4 text-white/50" />
              </Dialog.Close>
            </div>
            <div className="overflow-y-auto overflow-x-hidden px-5 pb-5">
              {!invoice ? (
                <>
                  <div className="relative flex h-40 flex-col">
                    <div className="inline-flex h-full flex-1 items-center justify-center gap-1">
                      <CurrencyInput
                        placeholder="0"
                        defaultValue={'21'}
                        value={amount}
                        decimalsLimit={2}
                        min={0} // 0 sats
                        max={10000} // 1M sats
                        maxLength={10000} // 1M sats
                        onValueChange={(value) => setAmount(value)}
                        className="w-full flex-1 bg-transparent text-right text-4xl font-semibold text-white placeholder:text-white/50 focus:outline-none"
                      />
                      <span className="w-full flex-1 text-left text-4xl font-semibold text-white/50">
                        sats
                      </span>
                    </div>
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAmount('69')}
                        className="w-max rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-sm font-medium hover:bg-white/10"
                      >
                        69 sats
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmount('100')}
                        className="w-max rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-sm font-medium hover:bg-white/10"
                      >
                        100 sats
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmount('200')}
                        className="w-max rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-sm font-medium hover:bg-white/10"
                      >
                        200 sats
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmount('500')}
                        className="w-max rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-sm font-medium hover:bg-white/10"
                      >
                        500 sats
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmount('1000')}
                        className="w-max rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-sm font-medium hover:bg-white/10"
                      >
                        1K sats
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex w-full flex-col gap-2">
                    <input
                      name="zapMessage"
                      value={zapMessage}
                      onChange={(e) => setZapMessage(e.target.value)}
                      spellCheck={false}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      placeholder="Enter message (optional)"
                      className="relative min-h-[56px] w-full resize-none rounded-lg bg-white/10 px-3 py-2 !outline-none backdrop-blur-xl placeholder:text-white/50"
                    />
                    <div className="flex flex-col gap-2">
                      {walletConnectURL ? (
                        <button
                          type="button"
                          onClick={() => createZapRequest()}
                          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-interor-500 px-4 font-medium text-white hover:bg-interor-600"
                        >
                          {isCompleted ? (
                            <p>Successfully tipped</p>
                          ) : isLoading ? (
                            <span className="flex flex-col">
                              <p className="mb-px leading-none">Waiting for approval</p>
                              <p className="text-xs leading-none text-white/70">
                                Go to your wallet and approve payment request
                              </p>
                            </span>
                          ) : (
                            <span className="flex flex-col">
                              <p className="mb-px leading-none">Send tip</p>
                              <p className="text-xs leading-none text-white/70">
                                You&apos;re using nostr wallet connect
                              </p>
                            </span>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => createZapRequest()}
                          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-interor-500 px-4 font-medium hover:bg-interor-600"
                        >
                          <p>Create Lightning invoice</p>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-3 flex flex-col items-center justify-center gap-4">
                  <div className="rounded-md bg-white p-3">
                    <QRCodeSVG value={invoice} size={256} />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-lg font-medium leading-none text-white">
                      Scan to pay
                    </h3>
                    <span className="text-center text-sm text-white/50">
                      You must use Bitcoin wallet which support Lightning
                      <br />
                      such as: Blue Wallet, Bitkit, Phoenix,...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
