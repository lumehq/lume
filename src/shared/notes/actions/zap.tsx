import { NostrEvent } from '@nostr-dev-kit/ndk';
import * as Dialog from '@radix-ui/react-dialog';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@shared/button';
import { CancelIcon, ZapIcon } from '@shared/icons';

import { useEvent } from '@utils/hooks/useEvent';
import { useNostr } from '@utils/hooks/useNostr';

export function NoteZap({ id }: { id: string }) {
  const { createZap } = useNostr();
  const { data: event } = useEvent(id);

  const [amount, setAmount] = useState<null | number>(null);
  const [invoice, setInvoice] = useState<null | string>(null);

  const selected = (num: number) => {
    if (amount === num) return true;
    return false;
  };

  const createZapRequest = async () => {
    // @ts-expect-error, todo: fix this
    const res = await createZap(event as unknown as NostrEvent, amount);
    if (res) setInvoice(res);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group inline-flex h-7 w-7 items-center justify-center"
        >
          <ZapIcon className="h-5 w-5 text-zinc-300 group-hover:text-orange-400" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal className="relative z-10">
        <Dialog.Overlay className="fixed inset-0 z-[1000px] bg-black bg-opacity-30 backdrop-blur-md data-[state=open]:animate-overlayShow" />
        <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center data-[state=open]:animate-contentShow">
          <Dialog.Content className="relative flex h-min w-full max-w-lg flex-col gap-2 rounded-lg border-t border-zinc-800/50 bg-zinc-900">
            <div className="relative h-min w-full shrink-0 border-b border-zinc-800 px-5 py-3">
              <div className="flex flex-col items-center gap-1.5">
                <Dialog.Title className="font-medium leading-none text-white">
                  Zap (Beta)
                </Dialog.Title>
                <Dialog.Description className="text-sm leading-none text-white/50">
                  Send tip with Bitcoin via Lightning
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-zinc-800"
                >
                  <CancelIcon className="h-4 w-4 text-zinc-300" />
                </button>
              </Dialog.Close>
            </div>
            <div className="overflow-y-auto overflow-x-hidden px-5 pb-5">
              {!invoice ? (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setAmount(21000)}
                      className={twMerge(
                        'inline-flex flex-col items-center justify-center gap-2 rounded-md px-2 py-2 hover:bg-zinc-800',
                        `${selected(21000) && 'bg-zinc-800'}`
                      )}
                    >
                      <img
                        className="h-12 w-12"
                        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png"
                        alt="High Voltage"
                      />
                      <span className="text-sm font-medium leading-none text-zinc-200">
                        21 sats
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(69000)}
                      className={twMerge(
                        'inline-flex flex-col items-center justify-center gap-2 rounded-md px-2 py-2 hover:bg-zinc-800',
                        `${selected(69000) && 'bg-zinc-800'}`
                      )}
                    >
                      <img
                        className="h-12 w-12"
                        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png"
                        alt="High Voltage"
                      />
                      <span className="text-sm font-medium leading-none text-zinc-200">
                        69 sats
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(100000)}
                      className={twMerge(
                        'inline-flex flex-col items-center justify-center gap-2 rounded-md px-2 py-2 hover:bg-zinc-800',
                        `${selected(100000) && 'bg-zinc-800'}`
                      )}
                    >
                      <img
                        className="h-12 w-12"
                        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png"
                        alt="High Voltage"
                      />
                      <span className="text-sm font-medium leading-none text-zinc-200">
                        100 sats
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(200000)}
                      className={twMerge(
                        'inline-flex flex-col items-center justify-center gap-2 rounded-md px-2 py-2 hover:bg-zinc-800',
                        `${selected(200000) && 'bg-zinc-800'}`
                      )}
                    >
                      <img
                        className="h-12 w-12"
                        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png"
                        alt="High Voltage"
                      />
                      <span className="text-sm font-medium leading-none text-zinc-200">
                        200 sats
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(500000)}
                      className={twMerge(
                        'inline-flex flex-col items-center justify-center gap-2 rounded-md px-2 py-2 hover:bg-zinc-800',
                        `${selected(500000) && 'bg-zinc-800'}`
                      )}
                    >
                      <img
                        className="h-12 w-12"
                        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png"
                        alt="High Voltage"
                      />
                      <span className="text-sm font-medium leading-none text-zinc-200">
                        500 sats
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount(1000000)}
                      className={twMerge(
                        'inline-flex flex-col items-center justify-center gap-2 rounded-md px-2 py-2 hover:bg-zinc-800',
                        `${selected(1000000) && 'bg-zinc-800'}`
                      )}
                    >
                      <img
                        className="h-12 w-12"
                        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/High%20Voltage.png"
                        alt="High Voltage"
                      />
                      <span className="text-sm font-medium leading-none text-zinc-200">
                        1000 sats
                      </span>
                    </button>
                  </div>
                  <div className="mt-4 flex w-full">
                    <Button onClick={() => createZapRequest()} preset="large">
                      Create invoice
                    </Button>
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
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
