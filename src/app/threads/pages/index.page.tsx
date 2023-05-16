import { NoteSkeleton } from "@app/note/components/skeleton";
import { ThreadBase } from "@app/threads/components/base";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getLongNotes } from "@utils/storage";
import { useEffect, useRef } from "react";

const ITEM_PER_PAGE = 10;
const TIME = Math.floor(Date.now() / 1000);

function isJSON(str: string) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export function Page() {
	const {
		status,
		error,
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	}: any = useInfiniteQuery({
		queryKey: ["threads"],
		queryFn: async ({ pageParam = 0 }) => {
			return await getLongNotes(TIME, ITEM_PER_PAGE, pageParam);
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	const allRows = data ? data.pages.flatMap((d: { data: any }) => d.data) : [];
	const parentRef = useRef();

	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 500,
		overscan: 2,
	});

	const itemsVirtualizer = rowVirtualizer.getVirtualItems();

	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

		if (!lastItem) {
			return;
		}

		if (
			lastItem.index >= allRows.length - 1 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [fetchNextPage, allRows.length, rowVirtualizer.getVirtualItems()]);

	return (
		<div
			ref={parentRef}
			className="scrollbar-hide h-full overflow-y-auto"
			style={{ contain: "strict" }}
		>
			{status === "loading" ? (
				<div className="px-3 py-1.5">
					<div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
						<NoteSkeleton />
					</div>
				</div>
			) : status === "error" ? (
				<div>{error.message}</div>
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
							const note = allRows[virtualRow.index];
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
			<div>
				{isFetching && !isFetchingNextPage ? (
					<div className="px-3 py-1.5">
						<div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
							<NoteSkeleton />
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
