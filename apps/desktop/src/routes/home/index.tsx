import { Antenas } from "@columns/antenas";
import { Default } from "@columns/default";
import { ForYou } from "@columns/foryou";
import { Global } from "@columns/global";
import { Group } from "@columns/group";
import { Hashtag } from "@columns/hashtag";
import { Thread } from "@columns/thread";
import { Timeline } from "@columns/timeline";
import { TrendingNotes } from "@columns/trending-notes";
import { User } from "@columns/user";
import { useColumnContext } from "@lume/ark";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	PlusIcon,
	PlusSquareIcon,
} from "@lume/icons";
import { IColumn } from "@lume/types";
import { TutorialModal } from "@lume/ui/src/tutorial/modal";
import { COL_TYPES } from "@lume/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { VList } from "virtua";

export function HomeScreen() {
	const { t } = useTranslation();
	const { columns, vlistRef, addColumn } = useColumnContext();

	const [selectedIndex, setSelectedIndex] = useState(-1);

	const renderItem = (column: IColumn) => {
		switch (column.kind) {
			case COL_TYPES.default:
				return <Default key={column.id} column={column} />;
			case COL_TYPES.newsfeed:
				return <Timeline key={column.id} column={column} />;
			case COL_TYPES.foryou:
				return <ForYou key={column.id} column={column} />;
			case COL_TYPES.thread:
				return <Thread key={column.id} column={column} />;
			case COL_TYPES.user:
				return <User key={column.id} column={column} />;
			case COL_TYPES.hashtag:
				return <Hashtag key={column.id} column={column} />;
			case COL_TYPES.group:
				return <Group key={column.id} column={column} />;
			case COL_TYPES.antenas:
				return <Antenas key={column.id} column={column} />;
			case COL_TYPES.global:
				return <Global key={column.id} column={column} />;
			case COL_TYPES.trendingNotes:
				return <TrendingNotes key={column.id} column={column} />;
			default:
				return <Default key={column.id} column={column} />;
		}
	};

	return (
		<div className="relative w-full h-full">
			<VList
				ref={vlistRef}
				className="h-full w-full flex-nowrap overflow-x-auto !overflow-y-hidden scrollbar-none focus:outline-none"
				itemSize={420}
				tabIndex={0}
				horizontal
				onKeyDown={(e) => {
					if (!vlistRef.current) return;
					switch (e.code) {
						case "ArrowUp":
						case "ArrowLeft": {
							e.preventDefault();
							const prevIndex = Math.max(selectedIndex - 1, 0);
							setSelectedIndex(prevIndex);
							vlistRef.current.scrollToIndex(prevIndex, {
								align: "center",
								smooth: true,
							});
							break;
						}
						case "ArrowDown":
						case "ArrowRight": {
							e.preventDefault();
							const nextIndex = Math.min(selectedIndex + 1, columns.length - 1);
							setSelectedIndex(nextIndex);
							vlistRef.current.scrollToIndex(nextIndex, {
								align: "center",
								smooth: true,
							});
							break;
						}
						default:
							break;
					}
				}}
			>
				{columns.map((column) => renderItem(column))}
				<div className="w-[420px] h-full flex items-center justify-center">
					<button
						type="button"
						onClick={async () =>
							await addColumn({
								kind: COL_TYPES.default,
								title: "",
								content: "",
							})
						}
						className="size-16 inline-flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-2xl"
					>
						<PlusIcon className="size-6" />
					</button>
				</div>
			</VList>
			<Tooltip.Provider>
				<div className="absolute bottom-3 right-3">
					<div className="flex items-center gap-1 p-1 bg-black/50 dark:bg-white/30 backdrop-blur-xl rounded-xl shadow-toolbar">
						<Tooltip.Root delayDuration={150}>
							<Tooltip.Trigger asChild>
								<button
									type="button"
									onClick={() => {
										const prevIndex = Math.max(selectedIndex - 1, 0);
										setSelectedIndex(prevIndex);
										vlistRef.current.scrollToIndex(prevIndex, {
											align: "center",
											smooth: true,
										});
									}}
									className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/30 size-10"
								>
									<ArrowLeftIcon className="size-5" />
								</button>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
									{t("global.moveLeft")}
									<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
						<Tooltip.Root delayDuration={150}>
							<Tooltip.Trigger asChild>
								<button
									type="button"
									onClick={() => {
										const nextIndex = Math.min(
											selectedIndex + 1,
											columns.length - 1,
										);
										setSelectedIndex(nextIndex);
										vlistRef.current.scrollToIndex(nextIndex, {
											align: "center",
											smooth: true,
										});
									}}
									className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/30 size-10"
								>
									<ArrowRightIcon className="size-5" />
								</button>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
									{t("global.moveRight")}
									<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
						<Tooltip.Root delayDuration={150}>
							<Tooltip.Trigger asChild>
								<button
									type="button"
									onClick={async () =>
										await addColumn({
											kind: COL_TYPES.default,
											title: "",
											content: "",
										})
									}
									className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/30 size-10"
								>
									<PlusSquareIcon className="size-5" />
								</button>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content className="inline-flex h-7 select-none text-neutral-50 dark:text-neutral-950 items-center justify-center rounded-md bg-neutral-950 dark:bg-neutral-50 px-3.5 text-sm will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade">
									{t("global.newColumn")}
									<Tooltip.Arrow className="fill-neutral-950 dark:fill-neutral-50" />
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
						<div className="w-px h-6 bg-white/10" />
						<TutorialModal />
					</div>
				</div>
			</Tooltip.Provider>
		</div>
	);
}
