import { useNewsfeed } from "@app/space/hooks/useNewsfeed";
import { getNotes } from "@libs/storage";
import { Note } from "@shared/notes/note";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { TitleBar } from "@shared/titleBar";
import { useNote } from "@stores/note";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";

const ITEM_PER_PAGE = 10;
const TIME = Math.floor(Date.now() / 1000);

export function FollowingBlock({ block }: { block: number }) {
	// subscribe for live update
	useNewsfeed();
	const [hasNewNote, toggleHasNewNote] = useNote((state) => [
		state.hasNewNote,
		state.toggleHasNewNote,
	]);

	const {
		status,
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	}: any = useInfiniteQuery({
		queryKey: ["newsfeed-circle"],
		queryFn: async ({ pageParam = 0 }) => {
			return await getNotes(TIME, ITEM_PER_PAGE, pageParam);
		},
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	const notes = data ? data.pages.flatMap((d: { data: any }) => d.data) : [];
	const parentRef = useRef();

	const rowVirtualizer = useVirtualizer({
		count: hasNextPage ? notes.length + 1 : notes.length,
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
			lastItem.index >= notes.length - 1 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [notes.length, fetchNextPage, rowVirtualizer.getVirtualItems()]);

	const refreshFirstPage = () => {
		// refetch
		refetch({ refetchPage: (page, index) => index === 0 });
		// scroll to top
		rowVirtualizer.scrollToIndex(1);
		// stop notify
		toggleHasNewNote(false);
	};

	const renderItem = (index: string | number) => {
		const note = notes[index];
		if (!note) return;
		return (
			<div key={index} data-index={index} ref={rowVirtualizer.measureElement}>
				<Note event={note} block={block} />
			</div>
		);
	};

	return (
		<div className="shrink-0 relative w-[400px] border-r border-zinc-900">
			<TitleBar title="Circle" />
			{hasNewNote && (
				<div className="z-50 absolute top-12 left-1/2 transform -translate-x-1/2">
					<button
						type="button"
						onClick={() => refreshFirstPage()}
						className="inline-flex items-center justify-center w-min px-3.5 py-1.5 rounded-full bg-fuchsia-500 hover:bg-fuchsia-600 border border-fuchsia-800/50 text-sm"
					>
						Newest
					</button>
				</div>
			)}
			<div
				ref={parentRef}
				className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 pb-20 overflow-y-auto"
				style={{ contain: "strict" }}
			>
				{status === "loading" ? (
					<div className="px-3 py-1.5">
						<div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
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
							{rowVirtualizer
								.getVirtualItems()
								.map((virtualRow) => renderItem(virtualRow.index))}
						</div>
					</div>
				)}
				{isFetchingNextPage && (
					<div className="px-3 py-1.5">
						<div className="rounded-xl border-t border-zinc-800/50 bg-zinc-900 px-3 py-3">
							<NoteSkeleton />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
