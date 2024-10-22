import { commands } from "@/commands.gen";
import { appSettings } from "@/commons";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export interface RouteSearch {
	label?: string;
	name?: string;
	redirect?: string;
}

export const Route = createFileRoute("/columns/_layout")({
	validateSearch: (search: Record<string, string>): RouteSearch => {
		return {
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
