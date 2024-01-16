import {
	HorizontalDotsIcon,
	MoveLeftIcon,
	MoveRightIcon,
	RefreshIcon,
	ThreadIcon,
	TrashIcon,
} from "@lume/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useColumnContext } from "./provider";

export function ColumnHeader({
	id,
	title,
	queryKey,
	icon,
}: {
	id: number;
	title: string;
	queryKey?: string[];
	icon?: ReactNode;
}) {
	const queryClient = useQueryClient();
	const { moveColumn, removeColumn } = useColumnContext();

	const refresh = async () => {
		if (queryKey) await queryClient.refetchQueries({ queryKey });
	};

	const moveLeft = async () => {
		moveColumn(id, "left");
	};

	const moveRight = async () => {
		moveColumn(id, "right");
	};

	const deleteWidget = async () => {
		await removeColumn(id);
	};

	return (
		<div className="flex items-center justify-between w-full px-3 border-b h-11 shrink-0 border-neutral-100 dark:border-neutral-900">
			<div className="inline-flex items-center gap-4">
				<div className="inline-flex items-center flex-1 gap-2 text-neutral-800 dark:text-neutral-200">
					{icon ? icon : <ThreadIcon className="size-4" />}
					<div className="text-sm font-medium">{title}</div>
				</div>
			</div>
			<div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button
							type="button"
							className="inline-flex items-center justify-center w-6 h-6"
						>
							<HorizontalDotsIcon className="size-4" />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content className="flex w-[200px] p-2 flex-col overflow-hidden rounded-2xl bg-black/70 dark:bg-white/20 backdrop-blur-lg focus:outline-none">
							<DropdownMenu.Item asChild>
								<button
									type="button"
									onClick={refresh}
									className="inline-flex items-center gap-2 px-3 text-sm font-medium rounded-lg h-9 text-white/50 hover:bg-black/10 hover:text-white focus:outline-none dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
								>
									<RefreshIcon className="size-5" />
									Refresh
								</button>
							</DropdownMenu.Item>
							<DropdownMenu.Item asChild>
								<button
									type="button"
									onClick={moveLeft}
									className="inline-flex items-center gap-2 px-3 text-sm font-medium rounded-lg h-9 text-white/50 hover:bg-black/10 hover:text-white focus:outline-none dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
								>
									<MoveLeftIcon className="size-5" />
									Move left
								</button>
							</DropdownMenu.Item>
							<DropdownMenu.Item asChild>
								<button
									type="button"
									onClick={moveRight}
									className="inline-flex items-center gap-2 px-3 text-sm font-medium rounded-lg h-9 text-white/50 hover:bg-black/10 hover:text-white focus:outline-none dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
								>
									<MoveRightIcon className="size-5" />
									Move right
								</button>
							</DropdownMenu.Item>
							<DropdownMenu.Separator className="h-px my-1 bg-white/10 dark:bg-black/10" />
							<DropdownMenu.Item asChild>
								<button
									type="button"
									onClick={deleteWidget}
									className="inline-flex items-center gap-2 px-3 text-sm font-medium text-red-300 rounded-lg h-9 hover:bg-red-500 hover:text-red-50 focus:outline-none"
								>
									<TrashIcon className="size-5" />
									Delete
								</button>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>
		</div>
	);
}
