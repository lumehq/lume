import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Outlet, createFileRoute } from "@tanstack/react-router";

type Search = {
	query: string;
};

export const Route = createFileRoute("/search")({
	validateSearch: (search: Record<string, string>): Search => {
		return {
			query: search.query,
		};
	},
	component: Screen,
});

function Screen() {
	const { query } = Route.useSearch();

	return (
		<div className="flex flex-col h-full">
			<div
				data-tauri-drag-region
				className="shrink-0 flex items-end gap-1 h-20 px-3 pb-3 w-full border-b border-black/10 dark:border-white/10"
			>
				Search result for: <span className="font-semibold">{query}</span>
			</div>
			<ScrollArea.Root
				type={"scroll"}
				scrollHideDelay={300}
				className="overflow-hidden size-full flex-1"
			>
				<Outlet />
				<ScrollArea.Scrollbar
					className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
					orientation="vertical"
				>
					<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className="bg-transparent" />
			</ScrollArea.Root>
		</div>
	);
}
