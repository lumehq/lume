import { checkForAppUpdates } from "@/commons";
import { NostrAccount } from "@/system";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		// Check for app updates
		await checkForAppUpdates(true);

		// Get all accounts
		const accounts = await NostrAccount.getAccounts();

		if (accounts.length < 1) {
			throw redirect({
				to: "/new",
				replace: true,
			});
		}

		return { accounts };
	},
});
