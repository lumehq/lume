import { commands } from "@/commands.gen";
import { NostrAccount } from "@/system";
import { Button } from "@getalby/bitcoin-connect-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export const Route = createLazyFileRoute("/$account/_settings/bitcoin-connect")(
	{
		component: Screen,
	},
);

function Screen() {
	const setNwcUri = async (uri: string) => {
		const res = await commands.setWallet(uri);

		if (res.status === "ok") {
			await getCurrentWebviewWindow().close();
		} else {
			throw new Error(res.error);
		}
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
