import { webln } from "@getalby/sdk";
import { useArk } from "@lume/ark";
import { useStorage } from "@lume/storage";
import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function NWCScreen() {
	const ark = useArk();
	const storage = useStorage();

	const [settings, setSettings] = useState({
		nwc: false,
		instantZap: storage.settings.instantZap,
	});
	const [walletConnectURL, setWalletConnectURL] = useState<null | string>(null);
	const [amount, setAmount] = useState("21");

	const saveNWC = async () => {
		try {
			if (!walletConnectURL.startsWith("nostr+walletconnect:")) {
				return toast.error(
					"Connect URI is required and must start with format nostr+walletconnect:, please check again",
				);
			}

			const uriObj = new URL(walletConnectURL);
			const params = new URLSearchParams(uriObj.search);

			if (params.has("relay") && params.has("secret")) {
				await storage.createPrivkey("Nostr Wallet Connect", walletConnectURL);

				storage.nwc = walletConnectURL;

				setWalletConnectURL(walletConnectURL);
				setSettings((state) => ({ ...state, nwc: true }));
			} else {
				return toast.error("Connect URI is not valid, please check again");
			}
		} catch (e) {
			toast.error(String(e));
		}
	};

	const toggleInstantZap = async () => {
		await storage.createSetting("instantZap", String(+!settings.instantZap));
		setSettings((state) => ({ ...state, instantZap: !settings.instantZap }));
	};

	const saveAmount = async () => {
		await storage.createSetting("zapAmount", amount);
	};

	const remove = async () => {
		await storage.removePrivkey(`${ark.account.pubkey}-nwc`);
		setWalletConnectURL(null);
	};

	const loadBalance = async () => {
		const nwc = new webln.NostrWebLNProvider({
			nostrWalletConnectUrl: walletConnectURL,
		});
		await nwc.enable();

		const balanceResponse = await nwc.getBalance();

		nwc.close();
	};

	useEffect(() => {
		if (storage.nwc) {
			setSettings((state) => ({ ...state, nwc: true }));
			setWalletConnectURL(storage.nwc);
		}
	}, []);

	return (
		<div className="mx-auto w-full max-w-lg">
			<div className="flex flex-col gap-6">
				<div className="flex w-full items-center justify-between">
					<div className="flex w-full items-center gap-8">
						<div className="w-36 shrink-0 text-end text-sm font-semibold">
							Connection String
						</div>
						<div className="relative w-full">
							<input
								type="password"
								spellCheck={false}
								value={walletConnectURL}
								onChange={(e) => setWalletConnectURL(e.target.value)}
								className="w-full border-transparent outline-none focus:outline-none focus:ring-0 focus:border-none h-9 rounded-lg ring-0 placeholder:text-neutral-600 bg-neutral-100 dark:bg-neutral-900"
							/>
							<div className="h-9 absolute right-0 top-0 inline-flex items-center justify-center">
								{!settings.nwc ? (
									<button
										type="button"
										onClick={saveNWC}
										className="mr-1 h-7 w-16 text-sm font-medium shrink-0 inline-flex items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
									>
										Save
									</button>
								) : (
									<button
										type="button"
										onClick={remove}
										className="mr-1 h-7 w-16 text-sm font-medium shrink-0 inline-flex items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
									>
										Remove
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
				{settings.nwc ? (
					<>
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-8">
								<div className="w-36 shrink-0 text-end text-sm font-semibold">
									Instant Zap
								</div>
								<div className="text-sm">
									Zap with default amount, no confirmation
								</div>
							</div>
							<Switch.Root
								checked={settings.instantZap}
								onClick={() => toggleInstantZap()}
								className="relative h-7 w-12 cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-blue-500 dark:bg-neutral-800"
							>
								<Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
							</Switch.Root>
						</div>
						<div className="flex w-full items-center justify-between">
							<div className="flex w-full items-center gap-8">
								<div className="w-36 shrink-0 text-end text-sm font-semibold">
									Default amount
								</div>
								<div className="relative w-full">
									<input
										type="number"
										spellCheck={false}
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										className="w-full border-transparent outline-none focus:outline-none focus:ring-0 focus:border-none h-9 rounded-lg ring-0 placeholder:text-neutral-600 bg-neutral-100 dark:bg-neutral-900"
									/>
									<div className="h-9 absolute right-0 top-0 inline-flex items-center justify-center">
										<button
											type="button"
											onClick={saveAmount}
											className="mr-1 h-7 w-16 text-sm font-medium shrink-0 inline-flex items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}
