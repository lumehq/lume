import { commands } from "@/commands.gen";
import { toLumeEvents } from "@/commons";
import { Spinner, TextNote, User } from "@/components";
import { type LumeEvent, LumeWindow } from "@/system";
import { Kind } from "@/types";
import { MagnifyingGlass } from "@phosphor-icons/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { createLazyFileRoute } from "@tanstack/react-router";
import { message } from "@tauri-apps/plugin-dialog";
import { useCallback, useRef, useState, useTransition } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/search")({
	component: Screen,
});

function Screen() {
	const [query, setQuery] = useState("");
	const [events, setEvents] = useState<LumeEvent[]>([]);
	const [isPending, startTransition] = useTransition();

	const ref = useRef<HTMLDivElement>(null);

	const renderItem = useCallback(
		(event: LumeEvent) => {
			if (!event) return;

			switch (event.kind) {
				case Kind.Text:
					return <TextNote key={event.id} event={event} className="mb-3" />;
				case Kind.Metadata:
					return (
						<div
							key={event.id}
							className="p-3 mb-3 bg-white dark:bg-black/20 rounded-xl shadow-primary dark:ring-1 dark:ring-white/5"
						>
							<User.Provider pubkey={event.pubkey}>
								<User.Root className="flex flex-col w-full h-full gap-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<User.Avatar className="rounded-full size-7" />
											<div className="inline-flex items-center gap-1">
												<User.Name className="text-sm leadning-tight max-w-[15rem] truncate font-semibold" />
												<User.NIP05 />
											</div>
										</div>
										<button
											type="button"
											onClick={() => LumeWindow.openProfile(event.pubkey)}
											className="inline-flex items-center justify-center w-16 text-sm font-medium rounded-md h-7 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
										>
											View
										</button>
									</div>
									<User.About className="select-text line-clamp-3 max-w-none text-neutral-800 dark:text-neutral-400" />
								</User.Root>
							</User.Provider>
						</div>
					);
				default:
					return <TextNote key={event.id} event={event} className="mb-3" />;
			}
		},
		[events],
	);

	const search = () => {
		startTransition(async () => {
			if (!query.length) return;

			const res = await commands.search(query, null);

			if (res.status === "ok") {
				const data = toLumeEvents(res.data);
				setEvents(data);
			} else {
				await message(res.error, { title: "Search", kind: "error" });
				return;
			}
		});
	};

	return (
		<div className="flex flex-col gap-3 size-full overflow-hidden">
			<div className="h-9 shrink-0 px-3 flex items-center gap-2">
				<input
					name="search"
					placeholder="Search nostr ..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") search();
					}}
					className="h-9 px-5 flex-1 rounded-full border-none bg-black/5 dark:bg-white/5 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:bg-black/10 dark:focus:bg-white/10	 focus:outline-none focus:ring-0"
				/>
				<button
					type="button"
					disabled={!query.length || isPending}
					className="size-9 shrink-0 inline-flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5"
				>
					{isPending ? (
						<Spinner className="size-4" />
					) : (
						<MagnifyingGlass className="size-4" />
					)}
				</button>
			</div>
			<ScrollArea.Root
				type={"scroll"}
				scrollHideDelay={300}
				className="overflow-hidden size-full flex-1"
			>
				<ScrollArea.Viewport ref={ref} className="relative h-full px-3">
					<Virtualizer scrollRef={ref}>
						{isPending ? (
							<div className="w-full h-[200px] flex gap-2 items-center justify-center">
								<Spinner />
								Searching...
							</div>
						) : !events.length ? (
							<div className="w-full h-[200px] flex gap-2 items-center justify-center">
								Type somethings to search.
							</div>
						) : (
							events.map((event) => renderItem(event))
						)}
					</Virtualizer>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar
					className="flex select-none touch-none p-0.5 duration-[160ms] ease-out data-[orientation=vertical]:w-2"
					orientation="vertical"
				>
					<ScrollArea.Thumb className="flex-1 bg-black/10 dark:bg-white/10 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner className="bg-transparent" />
			</ScrollArea.Root>
		</div>
	);
}
