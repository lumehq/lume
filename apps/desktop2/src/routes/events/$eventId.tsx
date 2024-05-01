import { useEvent } from "@lume/ark";
import { Box, Container, Note, Spinner, User } from "@lume/ui";
import { createFileRoute } from "@tanstack/react-router";
import { ReplyList } from "./-components/replyList";
import { WindowVirtualizer } from "virtua";
import type { Event } from "@lume/types";

export const Route = createFileRoute("/events/$eventId")({
	beforeLoad: async ({ context }) => {
		const ark = context.ark;
		const settings = await ark.get_settings();

		return { settings };
	},
	component: Event,
});

function Event() {
	const { eventId } = Route.useParams();
	const { isLoading, isError, data } = useEvent(eventId);

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<Spinner className="size-5" />
			</div>
		);
	}

	if (isError) {
		<div className="flex h-full w-full items-center justify-center">
			<p>Not found.</p>
		</div>;
	}

	return (
		<Container withDrag>
			<Box className="px-3 pt-3 scrollbar-none">
				<WindowVirtualizer>
					<MainNote data={data} />
					{data ? (
						<ReplyList eventId={eventId} />
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<Spinner className="size-5" />
						</div>
					)}
				</WindowVirtualizer>
			</Box>
		</Container>
	);
}

function MainNote({ data }: { data: Event }) {
	return (
		<Note.Provider event={data}>
			<Note.Root>
				<div className="px-3 h-14 flex items-center justify-between">
					<Note.User />
					<Note.Menu />
				</div>
				<Note.Content className="min-w-0" />
				<div className="mt-4 flex items-center justify-between">
					<div className="-ml-1 inline-flex items-center gap-4">
						<Note.Repost />
						<Note.Zap />
					</div>
					<Note.Menu />
				</div>
			</Note.Root>
		</Note.Provider>
	);
}
