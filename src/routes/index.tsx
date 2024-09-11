import { commands } from "@/commands.gen";
import { checkForAppUpdates } from "@/commons";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		// Check for app updates
		await checkForAppUpdates(true);

		// Get all accounts
		const accounts = await commands.getAccounts();

		if (accounts.length < 1) {
			throw redirect({
				to: "/new",
				replace: true,
			});
		}

		return { accounts: accounts.filter((account) => !account.endsWith("Lume")) };
	},
});
