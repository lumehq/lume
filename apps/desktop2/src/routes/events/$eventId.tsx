import { Note } from "@/components/note";
import { type LumeEvent, NostrQuery } from "@lume/system";
import { Box, Container, Spinner } from "@lume/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WindowVirtualizer } from "virtua";
import { Reply } from "./-components/reply";

export const Route = createFileRoute("/events/$eventId")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	loader: async ({ params }) => {
		const event = await NostrQuery.getEvent(params.eventId);
		return event;
	},
	component: Screen,
});

function Screen() {
	const event = Route.useLoaderData();

	const [reload, setReload] = useState(false);
	const [replies, setReplies] = useState<LumeEvent[]>(null);

	useEffect(() => {
		let mounted = true;

		if (event) {
			event.getAllReplies().then((data) => {
				if (mounted) setReplies(data);
			});
		}

		return () => {
			mounted = false;
		};
	}, [event]);

	return (
		<Container withDrag>
			<Box className="scrollbar-none">
				<WindowVirtualizer>
					<Note.Provider event={event}>
						<Note.Root>
							<div className="flex items-center justify-between px-3 h-14">
								<Note.User />
								<Note.Menu />
							</div>
							<Note.ContentLarge className="px-3" />
							<div className="flex items-center justify-end gap-2 px-3 mt-4 h-11">
								<Note.Reply large />
								<Note.Repost large />
								<Note.Zap large />
							</div>
						</Note.Root>
					</Note.Provider>
					<div className="flex flex-col">
						<div className="flex items-center px-3 text-sm font-semibold border-t h-11 text-neutral-700 dark:text-neutral-300 border-neutral-100 dark:border-neutral-900">
							Replies ({replies?.length ?? 0})
						</div>
						{!replies ? (
							<Spinner />
						) : !replies.length ? (
							<div className="flex items-center justify-center w-full">
								<div className="flex flex-col items-center justify-center gap-2 py-6">
									<h3 className="text-3xl">👋</h3>
									<p className="leading-none text-neutral-600 dark:text-neutral-400">
										Be the first to Reply!
									</p>
								</div>
							</div>
						) : (
							replies.map((event) => <Reply key={event.id} event={event} />)
						)}
					</div>
				</WindowVirtualizer>
			</Box>
		</Container>
	);
}
