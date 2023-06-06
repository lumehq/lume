import { NoteBase } from "@app/note/components/base";
import { NoteQuoteRepost } from "@app/note/components/quoteRepost";
import { NoteSkeleton } from "@app/note/components/skeleton";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getNotes } from "@utils/storage";
import { useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";

const ITEM_PER_PAGE = 10;
const TIME = Math.floor(Date.now() / 1000);

const fetcher = async ([, offset]) => getNotes(TIME, ITEM_PER_PAGE, offset);

export function FollowingBlock() {
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
		<div className="shrink-0 w-[420px] border-r border-zinc-900">
			<div
				data-tauri-drag-region
				className="h-11 w-full inline-flex items-center justify-center border-b border-zinc-900"
			>
				<h3 className="font-semibold text-zinc-100">Following</h3>
			</div>
			<div
				ref={parentRef}
				className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 overflow-y-auto"
				style={{ contain: "strict" }}
			>
				{!data || isLoading ? (
					<div className="px-3 py-1.5">
						<div className="rounded-md bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
							<NoteSkeleton />
						</div>
					</div>
				) : (
					<div
						className="relative w-full"
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
						}}
					>
						<div
							className="absolute left-0 top-0 w-full"
							style={{
								transform: `translateY(${
									itemsVirtualizer[0].start -
									rowVirtualizer.options.scrollMargin
								}px)`,
							}}
						>
							{rowVirtualizer.getVirtualItems().map((virtualRow) => {
								const note = notes[virtualRow.index];
								if (note) {
									if (note.kind === 1) {
										return (
											<div
												key={virtualRow.index}
												data-index={virtualRow.index}
												ref={rowVirtualizer.measureElement}
											>
												<NoteBase key={note.event_id} event={note} />
											</div>
										);
									} else {
										return (
											<div
												key={virtualRow.index}
												data-index={virtualRow.index}
												ref={rowVirtualizer.measureElement}
											>
												<NoteQuoteRepost key={note.event_id} event={note} />
											</div>
										);
									}
								}
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
