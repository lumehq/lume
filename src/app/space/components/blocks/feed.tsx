import { NoteBase } from "@app/note/components/base";
import { NoteQuoteRepost } from "@app/note/components/quoteRepost";
import { NoteSkeleton } from "@app/note/components/skeleton";
import { CancelIcon } from "@shared/icons";
import { useActiveAccount } from "@stores/accounts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getNotesByAuthor } from "@utils/storage";
import { useEffect, useRef } from "react";

const ITEM_PER_PAGE = 10;
const TIME = Math.floor(Date.now() / 1000);

export function FeedBlock({ params }: { params: any }) {
	const removeBlock = useActiveAccount((state: any) => state.removeBlock);

	const {
		status,
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
	}: any = useInfiniteQuery({
		queryKey: [params.title],
		queryFn: async ({ pageParam = 0 }) => {
			return await getNotesByAuthor(
				params.content,
				TIME,
				ITEM_PER_PAGE,
				pageParam,
			);
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

	const close = () => {
		removeBlock(params.id);
	};

	return (
		<div className="shrink-0 w-[420px] border-r border-zinc-900">
			<div
				data-tauri-drag-region
				className="h-11 w-full flex items-center justify-between px-3 border-b border-zinc-900"
			>
				<div className="w-9 h-6" />
				<h3 className="font-semibold text-zinc-100">{params.title}</h3>
				<button
					type="button"
					onClick={() => close()}
					className="inline-flex h-6 w-9 shrink items-center justify-center rounded bg-zinc-900 group-hover:bg-zinc-800"
				>
					<CancelIcon width={14} height={14} className="text-zinc-500" />
				</button>
			</div>
			<div
				ref={parentRef}
				className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 overflow-y-auto"
				style={{ contain: "strict" }}
			>
				{status === "loading" ? (
					<div className="px-3 py-1.5">
						<div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
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
					{isFetching && !isFetchingNextPage && (
						<div className="px-3 py-1.5">
							<div className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
								<NoteSkeleton />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
