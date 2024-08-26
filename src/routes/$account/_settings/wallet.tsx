import { commands } from "@/commands.gen";
import { getBitcoinDisplayValues } from "@/commons";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$account/_settings/wallet")({
	beforeLoad: async ({ params }) => {
		const query = await commands.loadWallet();

		if (query.status === "ok") {
			const wallet = Number.parseInt(query.data);
			const balance = getBitcoinDisplayValues(wallet);

			return { balance };
		} else {
			throw redirect({
				to: "/$account/bitcoin-connect",
				params: { account: params.account },
			});
		}
	},
});
