import { Hashtag } from "@columns/hashtag";
import { Thread } from "@columns/thread";
import { Timeline } from "@columns/timeline";
import { User } from "@columns/user";
import { useColumnContext } from "@lume/ark";
import { IColumn } from "@lume/types";
import { COL_TYPES } from "@lume/utils";
import { useRef, useState } from "react";
import { VList, VListHandle } from "virtua";

export function HomeScreen() {
	const ref = useRef<VListHandle>(null);
	const { columns } = useColumnContext();
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const renderItem = (column: IColumn) => {
		switch (column.kind) {
			case COL_TYPES.newsfeed:
				return <Timeline key={column.id} />;
			case COL_TYPES.thread:
				return <Thread key={column.id} column={column} />;
			case COL_TYPES.user:
				return <User key={column.id} column={column} />;
			case COL_TYPES.hashtag:
				return <Hashtag key={column.id} column={column} />;
			default:
				return <Timeline key={column.id} />;
		}
	};

	return (
		<div className="h-full w-full">
			<VList
				ref={ref}
				className="h-full w-full flex-nowrap overflow-x-auto !overflow-y-hidden scrollbar-none focus:outline-none"
				initialItemSize={420}
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
			</VList>
		</div>
	);
}
