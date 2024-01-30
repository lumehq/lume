import {
	ChevronDownIcon,
	MoveLeftIcon,
	MoveRightIcon,
	RefreshIcon,
	TrashIcon,
} from "@lume/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { InterestModal } from "./interestModal";
import { useColumnContext } from "./provider";

export function ColumnHeader({
	id,
	title,
	queryKey,
}: {
	id: number;
	title: string;
	queryKey?: string[];
}) {
	const queryClient = useQueryClient();

	const { t } = useTranslation();
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
		<DropdownMenu.Root>
			<div className="flex items-center justify-center gap-2 px-3 w-full border-b h-11 shrink-0 border-neutral-100 dark:border-neutral-900">
				<DropdownMenu.Trigger asChild>
					<div className="inline-flex items-center gap-1.5">
						<div className="text-[13px] font-medium">{title}</div>
						<ChevronDownIcon className="size-5" />
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						sideOffset={5}
						className="flex w-[200px] p-2 flex-col overflow-hidden rounded-2xl bg-white/50 dark:bg-black/50 ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-2xl focus:outline-none"
					>
						<DropdownMenu.Item asChild>
							<button
								type="button"
								onClick={refresh}
								className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
							>
								<RefreshIcon className="size-4" />
								{t("global.refresh")}
							</button>
						</DropdownMenu.Item>
						{queryKey?.[0] === "foryou-9998" ? (
							<DropdownMenu.Item asChild>
								<InterestModal
									queryKey={queryKey}
									className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
								/>
							</DropdownMenu.Item>
						) : null}
						<DropdownMenu.Item asChild>
							<button
								type="button"
								onClick={moveLeft}
								className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
							>
								<MoveLeftIcon className="size-4" />
								{t("global.moveLeft")}
							</button>
						</DropdownMenu.Item>
						<DropdownMenu.Item asChild>
							<button
								type="button"
								onClick={moveRight}
								className="inline-flex items-center gap-3 px-3 text-sm font-medium rounded-lg h-9 text-black/70 hover:bg-black/10 hover:text-black focus:outline-none dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
							>
								<MoveRightIcon className="size-4" />
								{t("global.moveRight")}
							</button>
						</DropdownMenu.Item>
						<DropdownMenu.Separator className="h-px my-1 bg-black/10 dark:bg-white/10" />
						<DropdownMenu.Item asChild>
							<button
								type="button"
								onClick={deleteWidget}
								className="inline-flex items-center gap-3 px-3 text-sm font-medium text-red-500 rounded-lg h-9 hover:bg-red-500 hover:text-red-50 focus:outline-none"
							>
								<TrashIcon className="size-4" />
								{t("global.Delete")}
							</button>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</div>
		</DropdownMenu.Root>
	);
}
