import { Outlet, createFileRoute } from "@tanstack/react-router";

export interface RouteSearch {
	account?: string;
	label?: string;
	name?: string;
	redirect?: string;
}

export const Route = createFileRoute("/columns/_layout")({
	validateSearch: (search: Record<string, string>): RouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	component: Layout,
});

function Layout() {
	return <Outlet />;
}
