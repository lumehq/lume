import { commands } from "@/commands.gen";
import { getBitcoinDisplayValues } from "@/commons";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/$id/wallet")({
	beforeLoad: async ({ params }) => {
		const query = await commands.loadWallet();

		if (query.status === "ok") {
			const wallet = Number.parseInt(query.data);
			const balance = getBitcoinDisplayValues(wallet);

			return { balance };
		} else {
			throw redirect({
				to: "/settings/$id/bitcoin-connect",
				params: { id: params.id },
			});
		}
	},
});
