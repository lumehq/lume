import { commands } from "@/commands.gen";
import { createFileRoute } from "@tanstack/react-router";

type RouteSearch = {
	account: string;
};

export const Route = createFileRoute("/set-group")({
	validateSearch: (search: Record<string, string>): RouteSearch => {
		return {
			account: search.account,
		};
	},
	loader: async () => {
		const res = await commands.getContactList();

		if (res.status === "ok") {
			return res.data;
		} else {
			throw new Error(res.error);
		}
	},
});
