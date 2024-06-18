import { GlobalIcon, LaurelIcon } from "@lume/icons";
import { cn } from "@lume/utils";
import { Link } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/store")({
	component: Screen,
});

function Screen() {
	return (
		<div className="flex flex-col h-full">
			<div className="px-3 mt-2 mb-1">
				<div className="inline-flex items-center w-full gap-1 p-1 rounded-lg shrink-0 bg-black/5 dark:bg-white/5">
					<Link to="/store/official" className="flex-1">
						{({ isActive }) => (
							<div
								className={cn(
									"inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md text-sm font-medium leading-tight",
									isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
								)}
							>
								<LaurelIcon className="size-4" />
								Official
							</div>
						)}
					</Link>
					<Link to="/store/community" className="flex-1">
						{({ isActive }) => (
							<div
								className={cn(
									"inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md text-sm font-medium leading-tight",
									isActive ? "bg-neutral-50 dark:bg-white/10" : "opacity-50",
								)}
							>
								<GlobalIcon className="size-4" />
								Community
							</div>
						)}
					</Link>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto scrollbar-none">
				<Outlet />
			</div>
		</div>
	);
}
