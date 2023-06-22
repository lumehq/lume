import { getNotesByAuthor } from "@libs/storage";
import { CancelIcon } from "@shared/icons";
import { Note } from "@shared/notes/note";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { TitleBar } from "@shared/titleBar";
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
		removeBlock(params.id, true);
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
		<div className="shrink-0 w-[400px] border-r border-zinc-900">
			<TitleBar title={params.title} onClick={() => close()} />
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
									return (
										<div
											key={virtualRow.index}
											data-index={virtualRow.index}
											ref={rowVirtualizer.measureElement}
										>
											<Note event={note} block={params.id} />
										</div>
									);
								}
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
