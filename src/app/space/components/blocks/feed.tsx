import { NoteBase } from "@app/space/components/notes/base";
import { NoteQuoteRepost } from "@app/space/components/notes/quoteRepost";
import { NoteSkeleton } from "@app/space/components/notes/skeleton";
import { getNotesByAuthor } from "@libs/storage";
import { CancelIcon } from "@shared/icons";
import { useActiveAccount } from "@stores/accounts";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";

const ITEM_PER_PAGE = 10;
const TIME = Math.floor(Date.now() / 1000);

const fetcher = async ([pubkey, offset]) =>
	getNotesByAuthor(pubkey, TIME, ITEM_PER_PAGE, offset);

export function FeedBlock({ params }: { params: any }) {
	const removeBlock = useActiveAccount((state: any) => state.removeBlock);

	const close = () => {
		removeBlock(params.id);
	};

	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.data) return null;
		if (pageIndex === 0) return [params.content, 0];
		return [params.content, previousPageData.nextCursor];
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
				className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 pb-20 overflow-y-auto"
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
												<NoteBase
													key={note.event_id}
													block={params.id}
													event={note}
												/>
											</div>
										);
									} else {
										return (
											<div
												key={virtualRow.index}
												data-index={virtualRow.index}
												ref={rowVirtualizer.measureElement}
											>
												<NoteQuoteRepost
													key={note.event_id}
													block={params.id}
													event={note}
												/>
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
