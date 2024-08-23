import { commands } from "@/commands.gen";
import { Note, ReplyNote, Spinner } from "@/components";
import { LumeEvent, useEvent } from "@/system";
import type { EventPayload } from "@/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useRef } from "react";
import { Virtualizer } from "virtua";

export const Route = createLazyFileRoute("/columns/_layout/events/$id")({
	component: Screen,
	pendingComponent: Pending,
});

function Pending() {
	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<Spinner className="size-5" />
		</div>
	);
}

function Screen() {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<ScrollArea.Root
			type={"scroll"}
			scrollHideDelay={300}
			className="overflow-hidden size-full flex-1"
		>
			<ScrollArea.Viewport ref={ref} className="h-full pt-1 px-3 pb-3">
				<Virtualizer scrollRef={ref}>
					<RootEvent />
					<ReplyList />
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
	);
}

function RootEvent() {
	const { id } = Route.useParams();
	const { data: event, error, isLoading, isError } = useEvent(id);

	if (isLoading) {
		return (
			<div className="bg-white flex items-center justify-center h-32 dark:bg-black/10 rounded-xl shadow-primary dark:ring-1 dark:ring-white/5">
				<div className="flex items-center gap-2 text-sm">
					<Spinner />
					Loading...
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="bg-white flex items-center justify-center h-32 dark:bg-black/10 rounded-xl shadow-primary dark:ring-1 dark:ring-white/5">
				<div className="flex items-center gap-2 text-sm text-red-500">
					{error.message}
				</div>
			</div>
		);
	}

	return (
		<Note.Provider event={event}>
			<Note.Root className="bg-white dark:bg-white/10 rounded-xl shadow-primary dark:shadow-none">
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.ContentLarge className="px-3" />
				<div className="flex items-center gap-2 px-3 mt-6 h-12 rounded-b-xl bg-neutral-50 dark:bg-white/5">
					<Note.Reply large />
					<Note.Repost large />
					<Note.Zap large />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}

function ReplyList() {
	const { id } = Route.useParams();
	const { queryClient } = Route.useRouteContext();
	const { data, isLoading } = useQuery({
		queryKey: ["reply", id],
		queryFn: async () => {
			const res = await commands.getReplies(id);

			if (res.status === "ok") {
				const events = res.data
					// Create Lume Events
					.map((item) => LumeEvent.from(item.raw, item.parsed))
					// Filter quote
					.filter(
						(ev) =>
							!ev.tags.filter((t) => t[0] === "q" || t[3] === "mention").length,
					);

				return events;
			} else {
				throw new Error(res.error);
			}
		},
		select: (events) => {
			const removeQueues = new Set();

			for (const event of events) {
				const tags = event.tags.filter((t) => t[0] === "e" && t[1] !== id);

				if (tags.length === 1) {
					const index = events.findIndex((ev) => ev.id === tags[0][1]);

					if (index !== -1) {
						const rootEvent = events[index];

						if (rootEvent.replies?.length) {
							rootEvent.replies.push(event);
						} else {
							rootEvent.replies = [event];
						}

						// Add current event to queue
						removeQueues.add(event.id);

						continue;
					}
				}

				for (const tag of tags) {
					const id = tag[1];
					const rootIndex = events.findIndex((ev) => ev.id === id);

					if (rootIndex !== -1) {
						const rootEvent = events[rootIndex];

						if (rootEvent.replies?.length) {
							const childIndex = rootEvent.replies.findIndex(
								(ev) => ev.id === id,
							);

							if (childIndex !== -1) {
								const childEvent = rootEvent.replies[rootIndex];

								if (childEvent.replies?.length) {
									childEvent.replies.push(event);
								} else {
									childEvent.replies = [event];
								}

								// Add current event to queue
								removeQueues.add(event.id);
							}
						} else {
							rootEvent.replies = [event];
							// Add current event to queue
							removeQueues.add(event.id);
						}
					}

					break;
				}
			}

			return events.filter((ev) => !removeQueues.has(ev.id));
		},
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		const unlisten = getCurrentWindow().listen<EventPayload>(
			"event",
			async (data) => {
				const event = LumeEvent.from(data.payload.raw, data.payload.parsed);
				await queryClient.setQueryData(
					["reply", id],
					(prevEvents: LumeEvent[]) => {
						if (!prevEvents) return [event];
						return [event, ...prevEvents];
					},
				);
			},
		);

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return (
		<div>
			<div className="flex items-center text-sm font-semibold h-14 text-neutral-600 dark:text-white/30">
				All replies
			</div>
			{isLoading ? (
				<div className="flex items-center justify-center w-full mb-3 h-12 bg-black/5 dark:bg-white/5 rounded-xl">
					<div className="flex items-center justify-center gap-2">
						<Spinner className="size-5" />
						<span className="text-sm font-medium">Getting replies...</span>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{!data.length ? (
						<div className="flex items-center justify-center w-full">
							<div className="flex flex-col items-center justify-center gap-2 py-4">
								<h3 className="text-3xl">👋</h3>
								<p className="leading-none text-neutral-600 dark:text-neutral-400">
									Be the first to Reply!
								</p>
							</div>
						</div>
					) : (
						data.map((event) => <ReplyNote key={event.id} event={event} />)
					)}
				</div>
			)}
		</div>
	);
}
