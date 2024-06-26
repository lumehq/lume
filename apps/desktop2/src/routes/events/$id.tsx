import { Note } from "@/components/note";
import { LumeEvent, NostrQuery } from "@lume/system";
import { createFileRoute } from "@tanstack/react-router";
import { Virtualizer } from "virtua";
import NoteParent from "./-components/parent";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useEffect, useRef, useState } from "react";
import { getCurrent } from "@tauri-apps/api/window";
import type { Meta } from "@lume/types";

type Payload = {
	raw: string;
	parsed: Meta;
};

export const Route = createFileRoute("/events/$id")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	loader: async ({ params }) => {
		const event = await NostrQuery.getEvent(params.id);
		return event;
	},
	component: Screen,
});

function Screen() {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<div className="h-full flex flex-col">
			<div
				data-tauri-drag-region
				className="shrink-0 h-8 w-full border-b border-black/5 dark:border-white/5"
			/>
			<ScrollArea.Root
				type={"scroll"}
				scrollHideDelay={300}
				className="overflow-hidden size-full flex-1"
			>
				<ScrollArea.Viewport ref={ref} className="h-full p-3">
					<RootEvent />
					<Virtualizer scrollRef={ref}>
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
		</div>
	);
}

function RootEvent() {
	const event = Route.useLoaderData();

	return (
		<Note.Provider event={event}>
			<Note.Root className="bg-white dark:bg-black/10 backdrop-blur rounded-xl shadow-primary dark:ring-1 dark:ring-white/5">
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
	const event = Route.useLoaderData();
	const [replies, setReplies] = useState<LumeEvent[]>([]);

	useEffect(() => {
		const unlistenEvent = getCurrent().listen<Payload>("new_reply", (data) => {
			const event = LumeEvent.from(data.payload.raw, data.payload.parsed);
			setReplies((prev) => [event, ...prev]);
		});

		const unlistenWindow = getCurrent().onCloseRequested(async () => {
			await event.unlistenEventReply();
			await getCurrent().destroy();
		});

		return () => {
			unlistenEvent.then((f) => f());
			unlistenWindow.then((f) => f());
		};
	}, []);

	useEffect(() => {
		let mounted = true;

		async function getReplies() {
			const data = await event.getEventReplies();

			if (mounted) {
				setReplies(data);
				// Start listen for new reply
				event.listenEventReply();
			}
		}

		getReplies();

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div>
			<div className="flex items-center text-sm font-semibold h-14 text-neutral-600 dark:text-white/30">
				All replies
			</div>
			<div className="flex flex-col gap-3">
				{!replies.length ? (
					<div className="flex items-center justify-center w-full">
						<div className="flex flex-col items-center justify-center gap-2 py-4">
							<h3 className="text-3xl">👋</h3>
							<p className="leading-none text-neutral-600 dark:text-neutral-400">
								Be the first to Reply!
							</p>
						</div>
					</div>
				) : (
					replies.map((event) => <NoteParent key={event.id} event={event} />)
				)}
			</div>
		</div>
	);
}
