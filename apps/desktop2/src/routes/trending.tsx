import { ArticleIcon, GroupFeedsIcon } from "@lume/icons";
import { NostrQuery } from "@lume/system";
import type { ColumnRouteSearch } from "@lume/types";
import { cn } from "@lume/utils";
import { Link, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trending")({
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
	component: Screen,
});

function Screen() {
	const search = Route.useSearch();

	return (
		<div className="flex flex-col h-full">
			<div className="inline-flex items-center w-full gap-1 px-3 h-11 shrink-0">
				<div className="inline-flex items-center w-full h-full gap-1">
					<Link to="/trending/notes" search={search}>
						{({ isActive }) => (
							<div
								className={cn(
									"inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
									isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
								)}
							>
								<ArticleIcon className="size-4" />
								Notes
							</div>
						)}
					</Link>
					<Link to="/trending/users" search={search}>
						{({ isActive }) => (
							<div
								className={cn(
									"inline-flex h-7 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
									isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
								)}
							>
								<GroupFeedsIcon className="size-4" />
								Users
							</div>
						)}
					</Link>
				</div>
			</div>
			<div className="flex-1 w-full h-full p-2 overflow-y-auto scrollbar-none">
				<Outlet />
			</div>
		</div>
	);
}
