import { cn } from "@/commons";
import type { ColumnRouteSearch } from "@/types";
import { Link, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/columns/_layout/create-newsfeed")({
	validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
		return {
			account: search.account,
			label: search.label,
			name: search.name,
		};
	},
	component: Screen,
});

function Screen() {
	const search = Route.useSearch();
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-4">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="font-serif text-2xl font-medium">
					Build up your timeline.
				</h1>
				<p className="leading-tight text-neutral-700 dark:text-neutral-300">
					Follow some people to keep up to date with them.
				</p>
			</div>
			<div className="flex flex-col w-4/5 max-w-full gap-3">
				<div className="w-full h-9 shrink-0 flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-lg px-0.5">
					<Link
						to="/columns/create-newsfeed/users"
						search={search}
						className="flex-1 h-8"
					>
						{({ isActive }) => (
							<div
								className={cn(
									"text-sm font-medium rounded-md h-full flex items-center justify-center",
									isActive
										? "bg-white dark:bg-white/20 shadow"
										: "bg-transparent",
								)}
							>
								Users
							</div>
						)}
					</Link>
					<Link
						to="/columns/create-newsfeed/f2f"
						search={search}
						className="flex-1 h-8"
					>
						{({ isActive }) => (
							<div
								className={cn(
									"rounded-md h-full flex items-center justify-center",
									isActive ? "bg-white dark:bg-white/20" : "bg-transparent",
								)}
							>
								Friend to Friend
							</div>
						)}
					</Link>
				</div>
				<Outlet />
			</div>
		</div>
	);
}
