import type { LumeColumn } from "@/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const Route = createLazyFileRoute("/columns/_layout/gallery")({
	component: Screen,
});

function Screen() {
	const { columns } = Route.useRouteContext();

	const install = async (column: LumeColumn) => {
		const mainWindow = getCurrentWindow();
		await mainWindow.emit("columns", { type: "add", column });
	};

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full"
		>
			<ScrollArea.Viewport className="relative h-full px-3">
				{columns.map((column) => (
					<div
						key={column.label}
						className="mb-3 group flex px-4 items-center justify-between h-16 rounded-xl bg-white dark:bg-black border-[.5px] border-neutral-300 dark:border-neutral-700"
					>
						<div className="text-sm">
							<div className="mb-px leading-tight font-semibold">
								{column.name}
							</div>
							<div className="leading-tight text-neutral-500 dark:text-neutral-400">
								{column.description}
							</div>
						</div>
						<button
							type="button"
							onClick={() => install(column)}
							className="text-xs uppercase font-semibold w-16 h-7 hidden group-hover:inline-flex items-center justify-center rounded-full bg-neutral-200 hover:bg-blue-500 hover:text-white dark:bg-black/10"
						>
							Open
						</button>
					</div>
				))}
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
				orientation="vertical"
			>
				<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner className="bg-transparent" />
		</ScrollArea.Root>
	);
}
