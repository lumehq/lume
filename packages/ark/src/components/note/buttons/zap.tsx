import { webln } from "@getalby/sdk";
import { SendPaymentResponse } from "@getalby/sdk/dist/types";
import { CancelIcon, ZapIcon } from "@lume/icons";
import {
	compactNumber,
	displayNpub,
	sendNativeNotification,
} from "@lume/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { invoke } from "@tauri-apps/api/core";
import { message } from "@tauri-apps/plugin-dialog";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../hooks/useProfile";
import { useArk, useStorage } from "../../../provider";
import { useNoteContext } from "../provider";

export function NoteZap() {
	const [walletConnectURL, setWalletConnectURL] = useState<string>(null);
	const [amount, setAmount] = useState<string>("21");
	const [zapMessage, setZapMessage] = useState<string>("");
	const [invoice, setInvoice] = useState<null | string>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const ark = useArk();
	const event = useNoteContext();
	const storage = useStorage();
	const nwc = useRef(null);
	const navigate = useNavigate();

	const { user } = useProfile(event.pubkey);

	const createZapRequest = async () => {
		try {
			if (!ark.ndk.signer) return navigate("/new/privkey");

			const zapAmount = parseInt(amount) * 1000;
			const res = await event.zap(zapAmount, zapMessage);

			if (!res)
				return await message("Cannot create zap request", {
					title: "Zap",
					type: "error",
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
					}`,
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
			await message(JSON.stringify(e), { title: "Zap", type: "error" });
		}
	};

	useEffect(() => {
		async function getWalletConnectURL() {
			const uri: string = await invoke("secure_load", {
				key: `${storage.account.pubkey}-nwc`,
			});
			if (uri) setWalletConnectURL(uri);
		}

		if (isOpen) getWalletConnectURL();

		return () => {
			setAmount("21");
			setZapMessage("");
			setIsCompleted(false);
			setIsLoading(false);
		};
	}, [isOpen]);

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="inline-flex items-center justify-center group h-7 w-7 text-neutral-600 dark:text-neutral-400"
				>
					<ZapIcon className="size-6 group-hover:text-blue-500" />
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-black/20" />
				<Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center min-h-full">
					<div className="relative w-full max-w-xl bg-white h-min rounded-xl dark:bg-black">
						<div className="inline-flex items-center justify-between w-full px-5 py-3 shrink-0">
							<div className="w-6" />
							<Dialog.Title className="font-semibold text-center">
								Send tip to{" "}
								{user?.name ||
									user?.displayName ||
									displayNpub(event.pubkey, 16)}
							</Dialog.Title>
							<Dialog.Close className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-900">
								<CancelIcon className="w-4 h-4" />
							</Dialog.Close>
						</div>
						<div className="px-5 pb-5 overflow-x-hidden overflow-y-auto">
							{!invoice ? (
								<>
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
											<span className="flex-1 w-full text-4xl font-semibold text-left text-neutral-600 dark:text-neutral-400">
												sats
											</span>
										</div>
										<div className="inline-flex items-center justify-center gap-2">
											<button
												type="button"
												onClick={() => setAmount("69")}
												className="w-max rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
											>
												69 sats
											</button>
											<button
												type="button"
												onClick={() => setAmount("100")}
												className="w-max rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
											>
												100 sats
											</button>
											<button
												type="button"
												onClick={() => setAmount("200")}
												className="w-max rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
											>
												200 sats
											</button>
											<button
												type="button"
												onClick={() => setAmount("500")}
												className="w-max rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
											>
												500 sats
											</button>
											<button
												type="button"
												onClick={() => setAmount("1000")}
												className="w-max rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-sm font-medium hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
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
											{walletConnectURL ? (
												<button
													type="button"
													onClick={() => createZapRequest()}
													className="inline-flex items-center justify-center w-full px-4 font-medium text-white bg-blue-500 rounded-lg h-11 hover:bg-blue-600"
												>
													{isCompleted ? (
														<p className="leading-tight">Successfully zapped</p>
													) : isLoading ? (
														<span className="flex flex-col">
															<p className="leading-tight">
																Waiting for approval
															</p>
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
											) : (
												<button
													type="button"
													onClick={() => createZapRequest()}
													className="inline-flex items-center justify-center w-full px-4 font-medium text-white bg-blue-500 rounded-lg h-11 hover:bg-blue-600"
												>
													Create Lightning invoice
												</button>
											)}
										</div>
									</div>
								</>
							) : (
								<div className="flex flex-col items-center justify-center gap-4 mt-3">
									<div className="p-3 rounded-md bg-neutral-100 dark:bg-neutral-900">
										<QRCodeSVG value={invoice} size={256} />
									</div>
									<div className="flex flex-col items-center gap-1">
										<h3 className="text-lg font-medium">Scan to zap</h3>
										<span className="text-sm text-center text-neutral-600 dark:text-neutral-400">
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
