import { Antenas } from "@columns/antenas";
import { Default } from "@columns/default";
import { ForYou } from "@columns/foryou";
import { Group } from "@columns/group";
import { Hashtag } from "@columns/hashtag";
import { Thread } from "@columns/thread";
import { Timeline } from "@columns/timeline";
import { User } from "@columns/user";
import { useColumnContext } from "@lume/ark";
import { ArrowLeftIcon, ArrowRightIcon, PlusSquareIcon } from "@lume/icons";
import { IColumn } from "@lume/types";
import { TutorialModal } from "@lume/ui/src/tutorial/modal";
import { COL_TYPES } from "@lume/utils";
import { useRef, useState } from "react";
import { VList, VListHandle } from "virtua";

export function HomeScreen() {
	const ref = useRef<VListHandle>(null);
	const { addColumn, columns } = useColumnContext();
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
			default:
				return <Default key={column.id} column={column} />;
		}
	};

	return (
		<div className="relative w-full h-full">
			<VList
				id="timeline"
				ref={ref}
				className="h-full w-full flex-nowrap overflow-x-auto !overflow-y-hidden scrollbar-none focus:outline-none"
				itemSize={420}
				tabIndex={0}
				horizontal
				onKeyDown={(e) => {
					if (!ref.current) return;
					switch (e.code) {
						case "ArrowUp":
						case "ArrowLeft": {
							e.preventDefault();
							const prevIndex = Math.max(selectedIndex - 1, 0);
							setSelectedIndex(prevIndex);
							ref.current.scrollToIndex(prevIndex, {
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
							ref.current.scrollToIndex(nextIndex, {
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
				<div className="w-[420px]" />
			</VList>
			<div className="absolute bottom-3 right-3">
				<div className="flex items-center gap-1 p-1 bg-black/30 dark:bg-white/30 backdrop-blur-xl rounded-xl">
					<button
						type="button"
						onClick={() => {
							const prevIndex = Math.max(selectedIndex - 1, 0);
							setSelectedIndex(prevIndex);
							ref.current.scrollToIndex(prevIndex, {
								align: "center",
								smooth: true,
							});
						}}
						className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/30 size-10"
					>
						<ArrowLeftIcon className="size-5" />
					</button>
					<button
						type="button"
						onClick={() => {
							const nextIndex = Math.min(selectedIndex + 1, columns.length - 1);
							setSelectedIndex(nextIndex);
							ref.current.scrollToIndex(nextIndex, {
								align: "center",
								smooth: true,
							});
						}}
						className="inline-flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-black/30 size-10"
					>
						<ArrowRightIcon className="size-5" />
					</button>
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
					<div className="w-px h-6 bg-white/10" />
					<TutorialModal />
				</div>
			</div>
		</div>
	);
}
