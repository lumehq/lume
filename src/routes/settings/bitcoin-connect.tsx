import { Button, init } from "@getalby/bitcoin-connect-react";
import { NostrAccount } from "@/system";
import { createFileRoute } from "@tanstack/react-router";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export const Route = createFileRoute("/settings/bitcoin-connect")({
	beforeLoad: () => {
		init({
			appName: "Lume",
			filters: ["nwc"],
			showBalance: true,
		});
	},
	component: Screen,
});

function Screen() {
	const setNwcUri = async (uri: string) => {
		const cmd = await NostrAccount.setWallet(uri);
		if (cmd) getCurrentWebviewWindow().close();
	};

	return (
		<div className="flex items-center justify-center size-full">
			<div className="flex flex-col items-center justify-center gap-3 text-center">
				<div>
					<p className="text-sm text-black/70 dark:text-white/70">
						Click to the button below to connect with your Bitcoin wallet.
					</p>
				</div>
				<Button
					onConnected={(provider) =>
						setNwcUri(provider.client.nostrWalletConnectUrl)
					}
				/>
			</div>
		</div>
	);
}
