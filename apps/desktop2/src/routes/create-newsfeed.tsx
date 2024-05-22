import { cn } from "@lume/utils";
import { Link, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-newsfeed")({
	component: Screen,
});

function Screen() {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-4">
			<div className="text-center flex flex-col items-center justify-center">
				<h1 className="text-2xl font-serif font-medium">
					Build up your timeline.
				</h1>
				<p className="leading-tight text-neutral-700 dark:text-neutral-300">
					Follow some people to keep up to date with them.
				</p>
			</div>
			<div className="w-4/5 max-w-full flex flex-col gap-3">
				<div className="w-full h-9 shrink-0 flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-lg px-0.5">
					<Link to="/create-newsfeed/users" className="flex-1 h-8">
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
					<Link to="/create-newsfeed/f2f" className="flex-1 h-8">
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
