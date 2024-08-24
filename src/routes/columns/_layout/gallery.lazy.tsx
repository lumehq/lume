import type { LumeColumn } from "@/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import Avatar from "boring-avatars";

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
						className="mb-3 group flex px-2 items-center justify-between h-16 rounded-xl bg-white dark:bg-white/20 shadow-sm shadow-neutral-500/10"
					>
						<div className="inline-flex items-center gap-2">
							<div className="size-11 bg-neutral-200 rounded-lg overflow-hidden">
								<Avatar
									name={column.name}
									size={44}
									square={true}
									variant="pixel"
									colors={[
										"#84cc16",
										"#22c55e",
										"#0ea5e9",
										"#3b82f6",
										"#6366f1",
									]}
								/>
							</div>
							<div className="text-sm">
								<div className="mb-px leading-tight font-semibold">
									{column.name}
								</div>
								<div className="leading-tight text-neutral-500 dark:text-neutral-400">
									{column.description}
								</div>
							</div>
						</div>
						<button
							type="button"
							onClick={() => install(column)}
							className="text-xs uppercase font-semibold w-max h-7 pl-2.5 pr-2 hidden group-hover:inline-flex items-center justify-center rounded-full bg-neutral-200 hover:bg-blue-500 hover:text-white dark:bg-black/10"
						>
							Install
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
