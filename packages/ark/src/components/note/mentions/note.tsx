import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import { memo } from "react";
import { Link } from "react-router-dom";
import { Note } from "..";
import { useEvent } from "../../../hooks/useEvent";

export const MentionNote = memo(function MentionNote({
	eventId,
}: { eventId: string }) {
	const { isLoading, isError, data } = useEvent(eventId);

	const renderKind = (event: NDKEvent) => {
		switch (event.kind) {
			case NDKKind.Text:
				return <Note.TextContent content={event.content} />;
			case NDKKind.Article:
				return <Note.ArticleContent eventId={event.id} tags={event.tags} />;
			case 1063:
				return <Note.MediaContent tags={event.tags} />;
			default:
				return <Note.TextContent content={event.content} />;
		}
	};

	if (isLoading) {
		return (
			<div className="w-full cursor-default rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
				Loading
			</div>
		);
	}

	if (isError) {
		return (
			<div className="w-full cursor-default rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
				Failed to fetch event
			</div>
		);
	}

	return (
		<Note.Provider event={data}>
			<Note.Root className="my-2 flex w-full cursor-default flex-col gap-1 rounded-lg bg-neutral-100 dark:bg-neutral-900">
				<div className="mt-3 px-3">
					<Note.User variant="mention" />
				</div>
				<div className="mt-1 px-3 pb-3">
					{renderKind(data)}
					<Link
						to={`/events/${data.id}`}
						className="mt-2 text-blue-500 hover:text-blue-600"
					>
						Show more
					</Link>
				</div>
			</Note.Root>
		</Note.Provider>
	);
});
