import { cn } from "@/commons";
import { NostrQuery } from "@/system";
import type { ColumnRouteSearch } from "@/types";
import { Note, UsersThree } from "@phosphor-icons/react";
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
			<div className="shrink-0 h-11 flex items-center w-full gap-1 px-3">
				<div className="flex w-full h-full gap-1">
					<Link to="/trending/notes" search={search}>
						{({ isActive }) => (
							<div
								className={cn(
									"inline-flex h-8 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
									isActive ? "bg-black/10 dark:bg-white/10" : "opacity-50",
								)}
							>
								<Note className="size-4" />
								Notes
							</div>
						)}
					</Link>
					<Link to="/trending/users" search={search}>
						{({ isActive }) => (
							<div
								className={cn(
									"inline-flex h-8 w-max items-center justify-center gap-2 rounded-full px-3 text-sm font-medium",
									isActive ? "bg-black/10 dark:bg-white/10" : "opacity-50",
								)}
							>
								<UsersThree className="size-4" />
								Users
							</div>
						)}
					</Link>
				</div>
			</div>
			<div className="flex-1 w-full h-full overflow-y-auto scrollbar-none">
				<Outlet />
			</div>
		</div>
	);
}
