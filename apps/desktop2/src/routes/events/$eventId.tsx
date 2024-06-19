import { Note } from "@/components/note";
import { type LumeEvent, NostrQuery, useEvent } from "@lume/system";
import { Box, Container, Spinner } from "@lume/ui";
import { createFileRoute } from "@tanstack/react-router";
import { WindowVirtualizer } from "virtua";
import { ReplyList } from "./-components/replyList";

export const Route = createFileRoute("/events/$eventId")({
	beforeLoad: async () => {
		const settings = await NostrQuery.getUserSettings();
		return { settings };
	},
	component: Screen,
});

function Screen() {
	const { eventId } = Route.useParams();
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-full">
				<Spinner className="size-5" />
			</div>
		);
	}

	if (isError) {
		<div className="flex items-center justify-center w-full h-full">
			<p>Not found.</p>
		</div>;
	}

	return (
		<Container withDrag>
			<Box className="scrollbar-none">
				<WindowVirtualizer>
					<MainNote data={data} />
					{data ? (
						<ReplyList eventId={eventId} />
					) : (
						<div className="flex items-center justify-center w-full h-full">
							<Spinner className="size-5" />
						</div>
					)}
				</WindowVirtualizer>
			</Box>
		</Container>
	);
}

function MainNote({ data }: { data: LumeEvent }) {
	return (
		<Note.Provider event={data}>
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
	);
}
