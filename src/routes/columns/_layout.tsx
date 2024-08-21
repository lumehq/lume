import { NostrQuery } from "@/system";
import type { ColumnRouteSearch } from "@/types";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	component: Layout,
});

function Layout() {
	return <Outlet />;
}
