import type { LumeColumn } from "@/types";
import { Plus } from "@phosphor-icons/react";
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
		<div className="flex flex-col items-center justify-center w-full h-full gap-4">
			<div className="flex flex-col items-center justify-center text-center">
				<h1 className="font-serif text-2xl font-medium">
					Custom your experiences
				</h1>
			</div>
			<div className="flex flex-col w-4/5 max-w-full gap-3">
				<ScrollArea.Root
					type={"scroll"}
					scrollHideDelay={300}
					className="flex-1 overflow-hidden w-full h-[450px] bg-black/5 dark:bg-white/5 rounded-xl"
				>
					<ScrollArea.Viewport className="h-full p-2">
						{columns.map((column) => (
							<div
								key={column.label}
								className="mb-3 group flex px-2 items-center justify-between h-11 rounded-lg bg-white dark:bg-white/20 shadow-sm shadow-neutral-500/10"
							>
								<div className="text-sm font-semibold">{column.name}</div>
								<button
									type="button"
									onClick={() => install(column)}
									className="text-sm font-medium w-16 h-7 hidden group-hover:inline-flex gap-1 items-center justify-center rounded-full bg-neutral-200 hover:bg-blue-500 hover:text-white dark:bg-black/10"
								>
									<Plus className="size-3" />
									Add
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
			</div>
		</div>
	);
}
