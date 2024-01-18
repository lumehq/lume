import { webln } from "@getalby/sdk";
import { type SendPaymentResponse } from "@getalby/sdk/dist/types";
import { CancelIcon, LoaderIcon, ZapIcon } from "@lume/icons";
import { useStorage } from "@lume/storage";
import { cn, compactNumber, displayNpub } from "@lume/utils";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { toast } from "sonner";
import { useArk } from "../../../hooks/useArk";
import { useProfile } from "../../../hooks/useProfile";
import { useNoteContext } from "../provider";

export function NoteZap() {
	const ark = useArk();
	const storage = useStorage();
	const event = useNoteContext();

	const [amount, setAmount] = useState<string>("21");
	const [zapMessage, setZapMessage] = useState<string>("");
	const [isOpen, setIsOpen] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { user } = useProfile(event.pubkey);

	const createZapRequest = async (instant?: boolean) => {
		if (!storage.nwc) return;

		let nwc: webln.NostrWebLNProvider = undefined;

		try {
			// start loading
			setIsLoading(true);

			const zapAmount = parseInt(amount) * 1000;
			const res = await event.zap(zapAmount, zapMessage);

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
							className="inline-flex items-center justify-center group size-7 text-neutral-600 dark:text-neutral-400"
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
						<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
							Zap
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
								className="inline-flex items-center justify-center group size-7 text-neutral-600 dark:text-neutral-400"
							>
								<ZapIcon className="size-5 group-hover:text-blue-500" />
							</button>
						</Tooltip.Trigger>
					</Dialog.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
							Zap
							<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
						</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm dark:bg-white/10" />
				<Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center min-h-full">
					<div className="relative w-full max-w-xl bg-white h-min rounded-xl dark:bg-black">
						<div className="inline-flex items-center justify-between w-full px-5 py-3 shrink-0">
							<div className="w-6" />
							<Dialog.Title className="font-semibold text-center">
								Send zap to{" "}
								{user?.name ||
									user?.displayName ||
									displayNpub(event.pubkey, 16)}
							</Dialog.Title>
							<Dialog.Close className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900">
								<CancelIcon className="w-4 h-4" />
							</Dialog.Close>
						</div>
						<div className="px-5 pb-5 overflow-x-hidden overflow-y-auto">
							<div className="relative flex flex-col h-40">
								<div className="inline-flex items-center justify-center flex-1 h-full gap-1">
									<CurrencyInput
										placeholder="0"
										defaultValue={"21"}
										value={amount}
										decimalsLimit={2}
										min={0} // 0 sats
										max={10000} // 1M sats
										maxLength={10000} // 1M sats
										onValueChange={(value) => setAmount(value)}
										className="flex-1 w-full text-4xl font-semibold text-right bg-transparent border-none placeholder:text-neutral-600 focus:outline-none focus:ring-0 dark:text-neutral-400"
									/>
									<span className="flex-1 w-full text-4xl font-semibold text-left text-neutral-500 dark:text-neutral-400">
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
							<div className="flex flex-col w-full gap-2 mt-4">
								<input
									name="zapMessage"
									value={zapMessage}
									onChange={(e) => setZapMessage(e.target.value)}
									spellCheck={false}
									autoComplete="off"
									autoCorrect="off"
									autoCapitalize="off"
									placeholder="Enter message (optional)"
									className="w-full resize-none rounded-lg border-transparent bg-neutral-100 px-3 py-3 !outline-none placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-900 dark:text-neutral-400"
								/>
								<div className="flex flex-col gap-2">
									<button
										type="button"
										onClick={() => createZapRequest()}
										className="inline-flex items-center justify-center w-full px-4 font-medium text-white bg-blue-500 rounded-lg h-11 hover:bg-blue-600"
									>
										{isCompleted ? (
											<p className="leading-tight">Successfully zapped</p>
										) : isLoading ? (
											<span className="flex flex-col">
												<p className="leading-tight">Waiting for approval</p>
												<p className="text-xs leading-tight text-neutral-100">
													Go to your wallet and approve payment request
												</p>
											</span>
										) : (
											<span className="flex flex-col">
												<p className="leading-tight">Send zap</p>
												<p className="text-xs leading-tight text-neutral-100">
													You&apos;re using nostr wallet connect
												</p>
											</span>
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
