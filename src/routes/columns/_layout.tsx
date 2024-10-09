import { commands } from "@/commands.gen";
import { appSettings } from "@/commons";
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
		const res = await commands.getUserSettings();

		if (res.status === "ok") {
			appSettings.setState((state) => {
				return { ...state, ...res.data };
			});
		} else {
			throw new Error(res.error);
		}
	},
	component: Layout,
});

function Layout() {
	return <Outlet />;
}
