import { NostrAccount } from "@/system";
import { createLazyFileRoute, redirect } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/$account/_settings/wallet")({
	component: Screen,
});

function Screen() {
	const { account } = Route.useParams();
	const { balance } = Route.useRouteContext();

	const disconnect = async () => {
		window.localStorage.removeItem("bc:config");
		await NostrAccount.removeWallet();

		return redirect({ to: "/$account/bitcoin-connect", params: { account } });
	};

	return (
		<div className="w-full px-3 pb-3">
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
