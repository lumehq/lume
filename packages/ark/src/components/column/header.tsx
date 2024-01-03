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
						<DropdownMenu.Content className="flex w-[200px] p-2 flex-col overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 dark:bg-neutral-950 focus:outline-none dark:border-neutral-900">
							<DropdownMenu.Item asChild>
								<button
									type="button"
									onClick={refresh}
									className="inline-flex items-center gap-2 px-3 text-sm font-medium rounded-lg h-9 text-neutral-700 hover:bg-blue-100 hover:text-blue-500 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
								>
									<RefreshIcon className="size-5" />
									Refresh
								</button>
							</DropdownMenu.Item>
							<DropdownMenu.Item asChild>
								<button
									type="button"
									onClick={moveLeft}
									className="inline-flex items-center gap-2 px-3 text-sm font-medium rounded-lg h-9 text-neutral-700 hover:bg-blue-100 hover:text-blue-500 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
								>
									<MoveLeftIcon className="size-5" />
									Move left
								</button>
							</DropdownMenu.Item>
							<DropdownMenu.Item asChild>
								<button
									type="button"
									onClick={moveRight}
									className="inline-flex items-center gap-2 px-3 text-sm font-medium rounded-lg h-9 text-neutral-700 hover:bg-blue-100 hover:text-blue-500 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
								>
									<MoveRightIcon className="size-5" />
									Move right
								</button>
							</DropdownMenu.Item>
							<DropdownMenu.Separator className="h-px my-1 bg-neutral-100 dark:bg-neutral-900" />
							<DropdownMenu.Item asChild>
								<button
									type="button"
									onClick={deleteWidget}
									className="inline-flex items-center gap-2 px-3 text-sm font-medium text-red-500 rounded-lg h-9 hover:bg-red-500 hover:text-red-50 focus:outline-none"
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
