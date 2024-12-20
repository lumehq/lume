import { commands } from "@/commands.gen";
import { Note, ReplyNote, Spinner } from "@/components";
import { LumeEvent, useEvent } from "@/system";
import type { EventPayload } from "@/types";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type RefObject, useEffect, useRef } from "react";
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
			className="overflow-hidden size-full px-3"
		>
			<ScrollArea.Viewport
				ref={ref}
				className="pb-3 relative h-full bg-white dark:bg-neutral-800 rounded-t-xl shadow shadow-neutral-300/50 dark:shadow-none border-[.5px] border-neutral-300 dark:border-neutral-700"
			>
				<Virtualizer scrollRef={ref as unknown as RefObject<HTMLElement>}>
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
			<div className="h-20 flex items-center justify-center gap-2 border-b-[.5px] border-neutral-300 dark:border-neutral-700">
				<Spinner className="size-4" />
				<p className="text-sm">Loading...</p>
			</div>
		);
	}

	if (isError || !event) {
		return (
			<div className="flex items-center gap-2 text-sm text-red-500 border-b-[.5px] border-neutral-300 dark:border-neutral-700">
				{error?.message || "Event not found within your current relay set"}
			</div>
		);
	}

	return (
		<Note.Provider event={event}>
			<Note.Root className="border-b-[.5px] border-neutral-300 dark:border-neutral-700">
				<div className="flex items-center justify-between px-3 h-14">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.ContentLarge className="px-3" />
				<div className="select-text flex items-center gap-2 px-3 mt-6 h-12 bg-neutral-50 dark:bg-white/5">
					<Note.Reply label />
					<Note.Repost label />
					<Note.Zap label />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}

function ReplyList() {
	const { id } = Route.useParams();
	const { queryClient } = Route.useRouteContext();
	const { data, isLoading } = useQuery({
		queryKey: ["replies", id],
		queryFn: async () => {
			const res = await commands.getReplies(id);

			if (res.status === "ok") {
				const events = res.data.map((item) =>
					LumeEvent.from(item.raw, item.parsed),
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
	});

	useEffect(() => {
		const unlisten = getCurrentWindow().listen<EventPayload>(
			"comment",
			async (data) => {
				const event = LumeEvent.from(data.payload.raw, data.payload.parsed);

				await queryClient.setQueryData(
					["replies", id],
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

	useEffect(() => {
		const unlisten = getCurrentWindow().listen(id, async () => {
			await queryClient.invalidateQueries({ queryKey: ["replies", id] });
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	return (
		<div className="px-3">
			<div className="flex items-center text-sm font-semibold h-14 text-neutral-600 dark:text-white/30">
				All replies
			</div>
			{isLoading ? (
				<div className="flex items-center justify-center gap-2">
					<Spinner className="size-4" />
					<span className="text-sm font-medium">Loading replies...</span>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{!data?.length ? (
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
