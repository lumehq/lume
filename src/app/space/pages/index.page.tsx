import { NoteBase } from "@app/note/components/base";
import { NoteQuoteRepost } from "@app/note/components/quoteRepost";
import { NoteSkeleton } from "@app/note/components/skeleton";
import { Header } from "@app/space/components/header";

import { getNotes } from "@utils/storage";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";

const ITEM_PER_PAGE = 10;
const TIME = Math.floor(Date.now() / 1000);

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
		queryKey: ["following"],
		queryFn: async ({ pageParam = 0 }) => {
			return await getNotes(TIME, ITEM_PER_PAGE, pageParam);
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	const allRows = data ? data.pages.flatMap((d: { data: any }) => d.data) : [];
	const parentRef = useRef();

	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? allRows.length + 1 : allRows.length,
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
			className="scrollbar-hide flex h-full flex-col justify-between gap-1.5 overflow-y-auto"
			style={{ contain: "strict" }}
		>
			<div className="pt-1.5">
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
								const note = allRows[virtualRow.index];
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
		</div>
	);
}
