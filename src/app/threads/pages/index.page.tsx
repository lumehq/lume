import { NoteSkeleton } from "@app/note/components/skeleton";
import { ThreadBase } from "@app/threads/components/base";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getLongNotes } from "@utils/storage";
import { useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";

const ITEM_PER_PAGE = 10;
const TIME = Math.floor(Date.now() / 1000);

const fetcher = async ([, offset]) => getLongNotes(TIME, ITEM_PER_PAGE, offset);

function isJSON(str: string) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export function Page() {
	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.data) return null;
		if (pageIndex === 0) return ["following", 0];
		return ["following", previousPageData.nextCursor];
	};

	const { data, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);

	const notes = useMemo(
		() => (data ? data.flatMap((d) => d.data) : []),
		[data],
	);

	const parentRef = useRef();
	const rowVirtualizer = useVirtualizer({
		count: notes.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 400,
		overscan: 2,
	});
	const itemsVirtualizer = rowVirtualizer.getVirtualItems();

	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

		if (!lastItem) {
			return;
		}

		if (lastItem.index >= notes.length - 1) {
			setSize(size + 1);
		}
	}, [notes.length, rowVirtualizer.getVirtualItems()]);

	return (
		<div
			ref={parentRef}
			className="scrollbar-hide h-full overflow-y-auto"
			style={{ contain: "strict" }}
		>
			{!data || isLoading ? (
				<div className="px-3 py-1.5">
					<div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
						<NoteSkeleton />
					</div>
				</div>
			) : (
				<div
					className="relative w-full mt-2"
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
					}}
				>
					<div
						className="absolute left-0 top-0 w-full"
						style={{
							transform: `translateY(${
								itemsVirtualizer[0].start - rowVirtualizer.options.scrollMargin
							}px)`,
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const note = notes[virtualRow.index];
							if (note && isJSON(note.tags)) {
								return (
									<div
										key={virtualRow.index}
										data-index={virtualRow.index}
										ref={rowVirtualizer.measureElement}
									>
										<ThreadBase key={note.event_id} event={note} />
									</div>
								);
							}
						})}
					</div>
				</div>
			)}
		</div>
	);
}
