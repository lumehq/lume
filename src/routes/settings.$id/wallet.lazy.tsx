import { commands } from "@/commands.gen";
import { Button } from "@getalby/bitcoin-connect-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createLazyFileRoute("/settings/$id/wallet")({
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
				<h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
					Wallet
				</h2>
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
