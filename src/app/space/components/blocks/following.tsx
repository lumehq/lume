import { createNote, getNotes } from "@libs/storage";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Note } from "@shared/notes/note";
import { NoteSkeleton } from "@shared/notes/skeleton";
import { RelayContext } from "@shared/relayProvider";
import { useActiveAccount } from "@stores/accounts";
import { useVirtualizer } from "@tanstack/react-virtual";
import { dateToUnix } from "@utils/date";
import { useContext, useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import useSWRSubscription from "swr/subscription";

const ITEM_PER_PAGE = 10;
const TIME = Math.floor(Date.now() / 1000);

const fetcher = async ([, offset]) => getNotes(TIME, ITEM_PER_PAGE, offset);

export function FollowingBlock({ block }: { block: number }) {
	const ndk = useContext(RelayContext);
	const account = useActiveAccount((state: any) => state.account);

	const getKey = (pageIndex, previousPageData) => {
		if (previousPageData && !previousPageData.data) return null;
		if (pageIndex === 0) return ["following", 0];
		return ["following", previousPageData.nextCursor];
	};

	// fetch initial notes
	const { data, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher);
	// fetch live notes
	useSWRSubscription(account ? "eventCollector" : null, () => {
		const follows = JSON.parse(account.follows);
		const sub = ndk.subscribe({
			kinds: [1, 6],
			authors: follows,
			since: dateToUnix(),
		});

		sub.addListener("event", (event: NDKEvent) => {
			// save note
			createNote(
				event.id,
				event.pubkey,
				event.kind,
				event.tags,
				event.content,
				event.created_at,
			);
		});

		return () => {
			sub.stop();
		};
	});

	const notes = useMemo(
		() => (data ? data.flatMap((d) => d.data) : []),
		[data],
	);

	const parentRef = useRef();

	const rowVirtualizer = useVirtualizer({
		count: notes.length,
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

		if (lastItem.index >= notes.length - 1) {
			setSize(size + 1);
		}
	}, [notes.length, rowVirtualizer.getVirtualItems()]);

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
		<div className="shrink-0 w-[400px] border-r border-zinc-900">
			<div
				data-tauri-drag-region
				className="h-11 w-full inline-flex items-center justify-center border-b border-zinc-900"
			>
				<h3 className="font-semibold text-zinc-100">Following</h3>
			</div>
			<div
				ref={parentRef}
				className="scrollbar-hide flex w-full h-full flex-col justify-between gap-1.5 pt-1.5 pb-20 overflow-y-auto"
				style={{ contain: "strict" }}
			>
				{isLoading && (
					<div className="px-3 py-1.5">
						<div className="rounded-md bg-zinc-900 px-3 py-3 shadow-input shadow-black/20">
							<NoteSkeleton />
						</div>
					</div>
				)}
				{!data ? (
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
							{rowVirtualizer
								.getVirtualItems()
								.map((virtualRow) => renderItem(virtualRow.index))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
