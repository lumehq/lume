import { NostrAccount, NostrQuery } from "@/system";
import type { ColumnRouteSearch } from "@/types";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/newsfeed")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	beforeLoad: async ({ search }) => {
		const isContactListEmpty = await NostrAccount.isContactListEmpty();
		const settings = await NostrQuery.getUserSettings();

		if (isContactListEmpty) {
			throw redirect({
				to: "/create-newsfeed/users",
				search: {
					...search,
					redirect: "/newsfeed",
				},
			});
		}

		return { settings };
	},
});
