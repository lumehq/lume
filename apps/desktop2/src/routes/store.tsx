import { CommunityIcon, LaurelIcon } from "@lume/icons";
import type { LumeColumn } from "@lume/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { createFileRoute } from "@tanstack/react-router";
import { resolveResource } from "@tauri-apps/api/path";
import { getCurrent } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";

export const Route = createFileRoute("/store")({
	beforeLoad: async () => {
		const path = "resources/official_columns.json";
		const resourcePath = await resolveResource(path);
		const fileContent = await readTextFile(resourcePath);
		const officialColumns: LumeColumn[] = JSON.parse(fileContent);

		return {
			officialColumns,
		};
	},
	component: Screen,
});

function Screen() {
	const { officialColumns } = Route.useRouteContext();

	const install = async (column: LumeColumn) => {
		const mainWindow = getCurrent();
		await mainWindow.emit("columns", { type: "add", column });
	};

	return (
		<div className="size-full">
			<ScrollArea.Root
				type={"scroll"}
				scrollHideDelay={300}
				className="flex-1 overflow-hidden size-full"
			>
				<ScrollArea.Viewport className="h-full px-3 ">
					<div className="flex flex-col gap-3 mb-10">
						<div className="inline-flex items-center gap-1.5 font-semibold leading-tight">
							<div className="size-7 rounded-md inline-flex items-center justify-center bg-black/10 dark:bg-white/10">
								<LaurelIcon className="size-4" />
							</div>
							Official
						</div>
						<div className="grid grid-cols-3 gap-4">
							{officialColumns.map((column) => (
								<div
									key={column.label}
									className="relative group flex flex-col w-full aspect-square overflow-hidden bg-white dark:bg-black/20 rounded-xl shadow-primary dark:ring-1 dark:ring-white/5"
								>
									<div className="hidden group-hover:flex items-center justify-center absolute inset-0 size-full rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-md">
										<button
											type="button"
											onClick={() => install(column)}
											className="w-16 h-8 inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-semibold"
										>
											Add
										</button>
									</div>
									<div className="flex-1">
										{column.cover ? (
											<img
												src={column.cover}
												srcSet={column.coverRetina}
												alt={column.name}
												loading="lazy"
												decoding="async"
												className="size-full object-cover"
											/>
										) : null}
									</div>
									<div className="shrink-0 h-9 px-3 flex items-center">
										<h3 className="text-sm font-semibold truncate w-full">
											{column.name}
										</h3>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<div className="inline-flex items-center gap-1.5 font-semibold leading-tight">
							<div className="size-7 rounded-md inline-flex items-center justify-center bg-black/10 dark:bg-white/10">
								<CommunityIcon className="size-4" />
							</div>
							Community
						</div>
						<div className="w-full h-20 rounded-xl flex items-center justify-center text-sm font-medium bg-black/5 dark:bg-white/5">
							Coming Soon.
						</div>
					</div>
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
	);
}
