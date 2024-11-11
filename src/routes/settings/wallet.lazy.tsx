import { commands } from "@/commands.gen";
import { Button } from "@getalby/bitcoin-connect-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/settings/wallet")({
	component: Screen,
});

function Screen() {
	const [_isConnect, setIsConnect] = useState(false);

	const setWallet = async (uri: string) => {
		const res = await commands.setWallet(uri);

		if (res.status === "ok") {
			setIsConnect((prev) => !prev);
		} else {
			throw new Error(res.error);
		}
	};

	const removeWallet = async () => {
		const res = await commands.removeWallet();

		if (res.status === "ok") {
			window.localStorage.removeItem("bc:config");
		} else {
			throw new Error(res.error);
		}
	};

	return (
		<div className="w-full px-3 pb-3">
			<div className="flex flex-col w-full gap-2">
				<div>
					<h2 className="text-sm font-semibold">Bitcoin Wallet</h2>
					<p className="text-sm text-neutral-500">
						Learn more about Zap{" "}
						<a
							href="https://nostr.how/en/zaps"
							target="_blank"
							rel="noreferrer"
							className="text-blue-500 !underline"
						>
							here
						</a>
					</p>
				</div>
				<div className="w-full h-44 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl">
					<Button
						onConnected={(provider) =>
							setWallet(provider.client.nostrWalletConnectUrl)
						}
						onDisconnected={() => removeWallet()}
					/>
				</div>
			</div>
		</div>
	);
}
