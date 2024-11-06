import { init } from "@getalby/bitcoin-connect-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/wallet")({
	beforeLoad: async () => {
		init({
			appName: "Lume",
			filters: ["nwc"],
			showBalance: true,
		});
	},
});
