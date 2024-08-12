import { NostrAccount, NostrQuery } from "@/system";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$account/")({
	beforeLoad: async ({ params }) => {
		const settings = await NostrQuery.getUserSettings();
		const accounts = await NostrAccount.getAccounts();
		const otherAccounts = accounts.filter(
			(account) => account !== params.account,
		);

		return { otherAccounts, settings };
	},
});
