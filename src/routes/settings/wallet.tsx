import { getBitcoinDisplayValues } from "@/commons";
import { NostrAccount } from "@/system";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/wallet")({
	beforeLoad: async () => {
		const wallet = await NostrAccount.loadWallet();
		if (!wallet) {
			throw redirect({ to: "/settings/bitcoin-connect" });
		}
		const balance = getBitcoinDisplayValues(wallet);
		return { balance };
	},
	component: Screen,
});

function Screen() {
	const { balance } = Route.useRouteContext();

	const disconnect = async () => {
		window.localStorage.removeItem("bc:config");
		await NostrAccount.removeWallet();

		return redirect({ to: "/settings/bitcoin-connect" });
	};

	return (
		<div className="w-full max-w-xl mx-auto">
			<div className="flex flex-col w-full gap-3">
				<div className="flex flex-col w-full px-3 bg-black/5 dark:bg-white/5 rounded-xl">
					<div className="flex items-center justify-between w-full gap-4 py-3">
						<div className="flex-1">
							<h3 className="font-medium">Connection</h3>
						</div>
						<div className="flex justify-end w-36 shrink-0">
							<button
								type="button"
								onClick={() => disconnect()}
								className="h-8 w-max px-2.5 text-sm rounded-lg inline-flex items-center justify-center bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20"
							>
								Disconnect
							</button>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full px-3 bg-black/5 dark:bg-white/5 rounded-xl">
					<div className="flex items-center justify-between w-full gap-4 py-3">
						<div className="flex-1">
							<h3 className="font-medium">Current Balance</h3>
						</div>
						<div className="flex justify-end w-36 shrink-0">
							₿ {balance.bitcoinFormatted}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
