import { webln } from "@getalby/sdk";
import { type SendPaymentResponse } from "@getalby/sdk/dist/types";
import { CancelIcon, LoaderIcon, ZapIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { cn, compactNumber, displayNpub } from "@lume/utils";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNoteContext } from "../provider";
import { useProfile } from "@lume/ark";

export function NoteZap() {
  const storage = useStorage();
  const event = useNoteContext();

  const [amount, setAmount] = useState<string>("21");
  const [zapMessage, setZapMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState<string>(null);

  const { t } = useTranslation();
  const { user } = useProfile(event.pubkey);

  const createZapRequest = async (instant?: boolean) => {
    if (instant && !storage.nwc) return;

    let nwc: webln.NostrWebLNProvider = undefined;

    try {
      // start loading
      setIsLoading(true);

      const zapAmount = parseInt(amount) * 1000;
      const res = await event.zap(zapAmount, zapMessage);

      if (!storage.nwc) return setInvoice(res);

      // user connect nwc
      nwc = new webln.NostrWebLNProvider({
        nostrWalletConnectUrl: storage.nwc,
      });
      await nwc.enable();

      // send payment via nwc
      const send: SendPaymentResponse = await nwc.sendPayment(res);

      if (send) {
        toast.success(
          `You've zapped ${compactNumber.format(send.amount)} sats to ${
            user?.name || user?.displayName || "anon"
          }`,
        );

        // reset after 1.5 secs
        if (!instant) {
          const timeout = setTimeout(() => setIsCompleted(false), 1500);
          clearTimeout(timeout);
        }
      }

      // eose
      nwc.close();

      // update state
      setIsCompleted(true);
      setIsLoading(false);
    } catch (e) {
      nwc?.close();
      setIsLoading(false);
      toast.error(String(e));
    }
  };

  if (storage.settings.instantZap) {
    return (
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={150}>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              onClick={() => createZapRequest(true)}
              className="group inline-flex h-7 w-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
            >
              {isLoading ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                <ZapIcon
                  className={cn(
                    "size-5 group-hover:text-blue-500",
                    isCompleted ? "text-blue-500" : "",
                  )}
                />
              )}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] dark:bg-neutral-50 dark:text-neutral-950">
              {t("note.zap.tooltip")}
              <Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={150}>
          <Dialog.Trigger asChild>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className="group inline-flex h-7 w-7 items-center justify-center text-neutral-800 dark:text-neutral-200"
              >
                <ZapIcon className="size-5 group-hover:text-blue-500" />
              </button>
            </Tooltip.Trigger>
          </Dialog.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade inline-flex h-7 select-none items-center justify-center rounded-md bg-neutral-950 px-3.5 text-sm text-neutral-50 will-change-[transform,opacity] dark:bg-neutral-50 dark:text-neutral-950">
              {t("note.zap.tooltip")}
              <Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-white/20" />
        <Dialog.Content className="fixed inset-0 z-50 flex min-h-full items-center justify-center">
          <Dialog.Close className="absolute right-5 top-5 z-50">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex size-10 items-center justify-center rounded-lg bg-white dark:bg-black">
                <CancelIcon className="size-5" />
              </div>
              <span className="text-sm font-medium">Esc</span>
            </div>
          </Dialog.Close>
          <div className="relative h-min w-full max-w-xl rounded-xl bg-white dark:bg-black">
            <div className="inline-flex w-full shrink-0 items-center justify-center px-5 py-3">
              <div className="w-6" />
              <Dialog.Title className="text-center font-semibold">
                {t("note.zap.modalTitle")}{" "}
                {user?.name ||
                  user?.displayName ||
                  displayNpub(event.pubkey, 16)}
              </Dialog.Title>
            </div>
            {!invoice ? (
              <div className="overflow-y-auto overflow-x-hidden px-5 pb-5">
                <div className="relative flex h-36 flex-col">
                  <div className="inline-flex h-full flex-1 items-center justify-center gap-1">
                    <CurrencyInput
                      placeholder="0"
                      defaultValue={"21"}
                      value={amount}
                      decimalsLimit={2}
                      min={0} // 0 sats
                      max={10000} // 1M sats
                      maxLength={10000} // 1M sats
                      onValueChange={(value) => setAmount(value)}
                      className="w-full flex-1 border-none bg-transparent text-right text-4xl font-semibold placeholder:text-neutral-600 focus:outline-none focus:ring-0 dark:text-neutral-400"
                    />
                    <span className="w-full flex-1 text-left text-4xl font-semibold text-neutral-500 dark:text-neutral-400">
                      sats
                    </span>
                  </div>
                  <div className="inline-flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAmount("69")}
                      className="w-max rounded-full bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                      69 sats
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount("100")}
                      className="w-max rounded-full bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                      100 sats
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount("200")}
                      className="w-max rounded-full bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                      200 sats
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount("500")}
                      className="w-max rounded-full bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                      500 sats
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmount("1000")}
                      className="w-max rounded-full bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
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
                    placeholder={t("note.zap.messagePlaceholder")}
                    className="w-full resize-none rounded-lg border-transparent bg-neutral-100 px-3 py-3 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:text-neutral-400"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => createZapRequest()}
                      className="inline-flex h-9 w-full items-center justify-center rounded-lg border-t border-neutral-900 bg-neutral-950 pb-[2px] font-semibold text-neutral-50 hover:bg-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                      {isCompleted
                        ? t("note.zap.buttonFinish")
                        : isLoading
                          ? t("note.zap.buttonLoading")
                          : t("note.zap.zap")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 px-5 pb-5">
                <div className="rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
                  <QRCodeSVG value={invoice} size={256} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <h3 className="text-lg font-medium">
                    {t("note.zap.invoiceButton")}
                  </h3>
                  <span className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                    {t("note.zap.invoiceFooter")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
