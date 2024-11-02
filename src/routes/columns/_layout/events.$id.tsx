import { commands } from "@/commands.gen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/events/$id")({
	beforeLoad: async () => {
		const accounts = await commands.getAccounts();
		return { accounts };
	},
});
